package models

import java.util.Date

import play.api.db._
import play.api.Play.current
import play.api.Logger

import anorm._
import anorm.SqlParser._

import org.postgresql.util.PGobject

import scala.language.postfixOps

object EntryFormat extends Enumeration {
  type EntryFormat = Value

  val Page, Post = Value

  def isValid(format: String) = EntryFormat.values.map(_.toString) contains format
}

object EntryStatus extends Enumeration {
  type EntryStatus = Value

  val Draft, Published, Removed = Value

  def isValid(status: String) = EntryStatus.values.map(_.toString) contains status
}

import EntryFormat._
import EntryStatus._

case class Entry(id: String,
                format: EntryFormat,
                title: String,
                md: String,
                html: String,
                status: EntryStatus,
                created: Date = new Date(),
                updated: Date = new Date())

object Entry {

  implicit def rowToEntryFormat: Column[EntryFormat] = Column.nonNull { (value, meta) =>
    val MetaDataItem(qualified, nullable, clazz) = meta
    value match {
      case p: PGobject => p.getValue match {
        case f: String => Right(EntryFormat withName f)
        case _ => Left(TypeDoesNotMatch(
          s"Cannot convert $value: ${value.asInstanceOf[AnyRef].getClass} for column $qualified"))
      }
      case _ => Left(TypeDoesNotMatch(
        s"Cannot convert $value: ${value.asInstanceOf[AnyRef].getClass} for column $qualified"))
    }
  }

  implicit def rowToEntryStatus: Column[EntryStatus] = Column.nonNull { (value, meta) =>
    val MetaDataItem(qualified, nullable, clazz) = meta
    value match {
      case p: PGobject => p.getValue match {
        case s: String => Right(EntryStatus withName s)
        case _ => Left(TypeDoesNotMatch("Cannot convert " + value + ":" +
          value.asInstanceOf[AnyRef].getClass + " for column " + qualified))
      }
      case _ => Left(TypeDoesNotMatch("Cannot convert " + value + ":" +
        value.asInstanceOf[AnyRef].getClass + " for column " + qualified))
    }
  }

  val simpleParser = {
    get[String]("entries.id") ~
      get[EntryFormat]("entries.format") ~
      get[String]("entries.title") ~
      get[String]("entries.md") ~
      get[String]("entries.html") ~
      get[EntryStatus]("entries.status") ~
      get[Date]("entries.created") ~
      get[Date]("entries.updated") map {
      case id~format~title~md~html~status~created~updated =>
        Entry(id, format, title, md, html, status, created, updated)
    }
  }

  def findAll(status: EntryStatus, offset: Int = 0, limit: Int = 10): Seq[Entry] = {
    DB.withConnection { implicit connection =>
      SQL("""
            SELECT * FROM entries
            WHERE status = {status}::status
            ORDER BY created DESC
            LIMIT {limit} OFFSET {offset}
          """
      ).on('status -> status.toString, 'offset -> offset, 'limit -> limit
        ).as(Entry.simpleParser *)
    }
  }

  def findAllByFormat(format: EntryFormat, status: EntryStatus, offset: Int = 0, limit: Int = 10): Seq[Entry] = {
    DB.withConnection { implicit connection =>
      SQL("""
            SELECT * FROM entries
            WHERE format = {format}::format AND status = {status}::status
            ORDER BY created DESC
            LIMIT {limit} OFFSET {offset}
          """
      ).on('format -> format.toString, 'status -> status.toString, 'offset -> offset, 'limit -> limit
        ).as(Entry.simpleParser *)
    }
  }

  def findById(id: String, status: EntryStatus): Option[Entry] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT * FROM entries WHERE id = {id} AND status = {status}::status").on(
        'id -> id, 'status -> status.toString
      ).as(Entry.simpleParser.singleOpt)
    }
  }

  def create(entry: Entry) {
    Logger.info(entry.id)
    DB.withTransaction { implicit connection =>
      Logger.info(entry.id)
      SQL(
        """
          INSERT INTO entries
          VALUES ({id}, {format}::format, {title}, {md}, {html}, {status}::status, {created}, {updated})
        """
      ).on(
          'id -> entry.id,
          'format -> entry.format.toString,
          'title -> entry.title,
          'md -> entry.md,
          'html -> entry.html,
          'status -> entry.status.toString,
          'created -> entry.created,
          'updated -> entry.updated
        ).executeUpdate()
    }
  }

  def update(entry: Entry) {
    DB.withConnection { implicit connection =>
      val updated = new Date()
      SQL(
        """
          UPDATE entries
          SET format = {format}::format, title = {title}, md = {md},
          html = {html}, status = {status}::status, updated = {updated}
          WHERE id = {id}
        """).on(
          'id -> entry.id,
          'format -> entry.format.toString,
          'title -> entry.title,
          'md -> entry.md,
          'html -> entry.html,
          'status -> entry.status.toString,
          'updated -> updated
        ).executeUpdate()
    }
  }

  def delete(id: String) {
    DB.withConnection { implicit connection =>
      val updated = new Date()
      SQL("UPDATE entries SET status = 'Removed', updated = {updated} WHERE id = {id}").on(
        'id -> id, 'updated -> updated
      ).executeUpdate()
    }
  }

}
