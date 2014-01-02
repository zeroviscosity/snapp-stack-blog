package controllers

import play.api._
import play.api.mvc._

import models.Entry
import models.EntryFormat._
import models.EntryStatus._

object Snapshot extends Controller {

  def posts() = Action {
    val entries = Entry.findAllByFormat(Post, Published, 0, 10000)
    Ok(views.html.snapshots.posts.render(entries.toList))
  }

  def page(id: String) = Action {
    Entry.findById(id, Published) match {
      case Some(entry) =>
        Ok(views.html.snapshots.page.render(entry))
      case None => BadRequest
    }
  }

  def post(id: String) = Action {
    Entry.findById(id, Published) match {
      case Some(entry) =>
        Ok(views.html.snapshots.post.render(entry))
      case None => BadRequest
    }
  }

}

