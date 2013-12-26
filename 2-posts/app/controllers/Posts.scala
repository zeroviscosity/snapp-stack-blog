package controllers

import play.api.data._
import play.api.data.Forms._

import play.api.mvc._
import play.api.mvc.Controller
import play.api.libs.json._

import play.api.Logger

import models.{Post, PostStatus}
import models.PostStatus._

object Posts extends Controller {

  implicit object PostWrites extends Writes[Post] {
    def writes(p: Post) = Json.obj(
      "id" -> Json.toJson(p.id),
      "title" -> Json.toJson(p.title),
      "content" -> Json.toJson(p.content),
      "status" -> Json.toJson(p.status.toString),
      "created" -> Json.toJson(p.created),
      "updated" -> Json.toJson(p.updated)
    )
  }

  def list = Action {
    val posts = Post.findAll(Published, 0, 10).map(Json.toJson(_))
    Ok(Json.toJson(posts))
  }

  def drafts = Action {
    val posts = Post.findAll(Draft, 0, 10).map(Json.toJson(_))
    Ok(Json.toJson(posts))
  }

  def single(id: String) = Action {
    Post.findById(id).map { post =>
      Ok(Json.toJson(post))
    }.getOrElse(NotFound)
  }

  val postForm = Form(
    tuple(
      "id" -> nonEmptyText,
      "title" -> nonEmptyText,
      "content" -> nonEmptyText,
      "status" -> nonEmptyText.verifying(PostStatus.isValid(_))
    )
  )

  def add = Action { implicit request =>
    Logger.info("Add request")
    postForm.bindFromRequest.fold(
    errors => BadRequest,
    {
      case (id, title, content, status) =>
        val post = Post(id, title, content, PostStatus withName status)
        Logger.info(post.title)
        Post.create(post)
        Ok("Added post")
    }
    )
  }

  def update = Action { implicit request =>
    Logger.info("Update request")
    postForm.bindFromRequest.fold(
    errors => BadRequest,
    {
      case (id, title, content, status) =>
        Post.update(
          Post(id, title, content, PostStatus withName status)
        )
        Ok("Updated post")
    }
    )
  }

  def delete(id: String) = Action {
    Logger.info("Delete requested")
    try {
      Post.delete(id)
      Ok("Deleted")
    }
    catch {
      case e:IllegalArgumentException => BadRequest("Post not found")
      case e:Exception => {
        Logger.info("exception = %s" format e)
        BadRequest("Invalid Id")
      }
    }
  }

}
