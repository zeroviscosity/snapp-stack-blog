package controllers

import play.api.data._
import play.api.data.Forms._
import play.api.mvc._
import play.api.mvc.Controller
import play.api.libs.json._
import play.api.Logger

import scala.util.{Try, Success, Failure}

import models.{Post, PostStatus}
import models.PostStatus._

case class ActionResponse(status: String, message: Option[String] = None)

object Posts extends Controller {

  def error(msg: String) = BadRequest(Json.toJson(Map("error" -> msg)))
  def success() = Ok(Json.toJson(Map("status" -> "ok")))

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

  def posts = Action {
    val posts = Post.findAll(Published, 0, 10).map(Json.toJson(_))
    Ok(Json.toJson(posts))
  }

  def post(id: String) = Action {
    Post.findById(id, Published).map { post =>
      Ok(Json.toJson(post))
    }.getOrElse(NotFound)
  }

  def drafts = Action {
    val posts = Post.findAll(Draft, 0, 10).map(Json.toJson(_))
    Ok(Json.toJson(posts))
  }

  def draft(id: String) = Action {
    Post.findById(id, Draft).map { post =>
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
      errors => BadRequest("Could not create post"), {
        case (id, title, content, status) =>
          Post.create(Post(id, title, content, PostStatus withName status))
          success()
      }
    )
  }

  def update = Action { implicit request =>
    Logger.info("Update request")

    postForm.bindFromRequest.fold(
      errors => BadRequest("Could not update post"),{
        case (id, title, content, status) =>
          Post.update(Post(id, title, content, PostStatus withName status))
          success()
      }
    )
  }

  def delete(id: String) = Action {
    Logger.info("Delete requested")
    Try {
      Post.delete(id)
    } match {
      case Success(result) => success()
      case Failure(e) => error(e.getMessage)
    }
  }

}
