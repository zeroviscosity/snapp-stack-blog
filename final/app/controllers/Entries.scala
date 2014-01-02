package controllers

import play.api.data._
import play.api.data.Forms._
import play.api.mvc._
import play.api.mvc.Controller
import play.api.libs.json._
import play.api.Logger

import scala.util.{Try, Success, Failure}

import eu.henkelmann.actuarius.ActuariusTransformer

import models.{Entry, EntryFormat, EntryStatus}
import models.EntryFormat._
import models.EntryStatus._

case class ActionResponse(status: String, message: Option[String] = None)

object Entries extends Controller {

  lazy val transformer = new ActuariusTransformer

  def error(msg: String) = BadRequest(Json.toJson(Map("error" -> msg)))
  def success() = Ok(Json.toJson(Map("status" -> "ok")))

  implicit object EntryWrites extends Writes[Entry] {
    def writes(p: Entry) = Json.obj(
      "id" -> Json.toJson(p.id),
      "title" -> Json.toJson(p.title),
      "md" -> Json.toJson(p.md),
      "html" -> Json.toJson(p.html),
      "status" -> Json.toJson(p.status.toString),
      "created" -> Json.toJson(p.created),
      "updated" -> Json.toJson(p.updated)
    )
  }
  
  def single(id: String, status: EntryStatus) = Action {
    Entry.findById(id, status).map { entry =>
      Ok(Json.toJson(entry))
    }.getOrElse(NotFound)
  }

  def many(format: Option[EntryFormat], status: EntryStatus, offset: Int, limit: Int) = Action {
    val entries = format match {
      case Some(f) => Entry.findAllByFormat(f, status, offset, limit).map(Json.toJson(_))
      case None => Entry.findAll(status, offset, limit).map(Json.toJson(_))
    }
    Ok(Json.toJson(entries))
  }

  def draft(id: String) = single(id, Draft)

  def published(id: String) = single(id, Published)
  
  def drafts(offset: Int, limit: Int) = many(None, Draft, offset, limit)

  def posts(offset: Int, limit: Int) = many(Some(Post), Published, offset, limit)

  lazy val postForm = Form(
    tuple(
      "id" -> nonEmptyText,
      "format" -> nonEmptyText.verifying(EntryFormat.isValid(_)),
      "title" -> nonEmptyText,
      "md" -> nonEmptyText,
      "status" -> nonEmptyText.verifying(EntryStatus.isValid(_))
    )
  )

  def add = Action { implicit request =>
    Logger.info(request.toString())
    postForm.bindFromRequest.fold(
      errors => BadRequest("Could not create entry"), {
        case (id, format, title, md, status) =>
          Logger.info(id)
          val html = transformer.apply(md)
          Logger.info(html)
          Entry.create(Entry(id, EntryFormat withName format, title, md, html.toString, EntryStatus withName status))
          success()
      }
    )
  }

  def update = Action { implicit request =>
    Logger.info(request.toString())
    postForm.bindFromRequest.fold(
      errors => BadRequest("Could not update entry"),{
        case (id, format, title, md, status) =>
          val html = transformer.apply(md)
          Entry.update(Entry(id, EntryFormat withName format, title, md, md, EntryStatus withName status))
          success()
      }
    )
  }

  def delete(id: String) = Action {
    Try {
      Entry.delete(id)
    } match {
      case Success(result) => success()
      case Failure(e) => error(e.getMessage)
    }
  }

}
