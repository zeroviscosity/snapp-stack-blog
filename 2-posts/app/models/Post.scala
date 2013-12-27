package models

import java.util.Date

import play.api.db._
import play.api.Play.current
import play.api.Logger

import anorm._
import anorm.SqlParser._

import org.postgresql.util.PGobject

import scala.language.postfixOps

object PostStatus extends Enumeration {
  type PostStatus = Value

  val Draft, Published, Removed = Value

  def isValid(status: String) = PostStatus.values.map(_.toString) contains status
}

import PostStatus._

case class Post(id: String,
                title: String,
                content: String,
                status: PostStatus,
                created: Date = new Date(),
                updated: Date = new Date())

object Post {

  implicit def rowToPostStatus: Column[PostStatus] = Column.nonNull { (value, meta) =>
    val MetaDataItem(qualified, nullable, clazz) = meta
    value match {
      case p: PGobject => p.getValue match {
        case s: String => Right(PostStatus withName s)
        case _ => Left(TypeDoesNotMatch("Cannot convert " + value + ":" +
          value.asInstanceOf[AnyRef].getClass + " for column " + qualified))
      }
      case _ => Left(TypeDoesNotMatch("Cannot convert " + value + ":" +
        value.asInstanceOf[AnyRef].getClass + " for column " + qualified))
    }
  }

  val simpleParser = {
    get[String]("posts.id") ~
      get[String]("posts.title") ~
      get[String]("posts.content") ~
      get[PostStatus]("posts.status") ~
      get[Date]("posts.created") ~
      get[Date]("posts.updated") map {
      case id~title~content~status~created~updated =>
        Post(id, title, content, status, created, updated)
    }
  }

  def findAll(status: PostStatus, offset: Int = 0, limit: Int = 10): Seq[Post] = {
    DB.withConnection { implicit connection =>
      SQL("""
            SELECT * FROM posts
            WHERE status = {status}::post_status
            ORDER BY created DESC
            LIMIT {limit} OFFSET {offset}
          """
      ).on('status -> status.toString, 'offset -> offset, 'limit -> limit
        ).as(Post.simpleParser *)
    }
  }

  def findById(id: String, status: PostStatus): Option[Post] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT * FROM posts WHERE id = {id} AND status = {status}::post_status").on(
        'id -> id, 'status -> status.toString
      ).as(Post.simpleParser.singleOpt)
    }
  }

  def create(post: Post) {
    Logger.info(post.id)
    DB.withTransaction { implicit connection =>
      Logger.info(post.id)
      SQL(
        """
          INSERT INTO posts
          VALUES ({id}, {title}, {content}, {status}::post_status, {created}, {updated})
        """
      ).on(
          'id -> post.id,
          'title -> post.title,
          'content -> post.content,
          'status -> post.status.toString,
          'created -> post.created,
          'updated -> post.updated
        ).executeUpdate()
    }
  }

  def update(post: Post) {
    DB.withConnection { implicit connection =>
      val updated = new Date()

      SQL(
        """
          UPDATE posts
          SET updated = {updated}, title = {title}, content = {content}, status = {status}::post_status
          WHERE id = {id}
        """).on(
          'id -> post.id,
          'updated -> updated,
          'title -> post.title,
          'content -> post.content,
          'status -> post.status.toString
        ).executeUpdate()
    }
  }

  def delete(id: String) {
    DB.withConnection { implicit connection =>
      SQL("UPDATE posts SET status = 'Removed' WHERE id = {id}").on(
        'id -> id
      ).executeUpdate()
    }
  }

}
