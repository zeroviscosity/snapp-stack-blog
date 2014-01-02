package controllers

import play.api._
import play.api.mvc._

import models.Entry
import models.EntryStatus._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def page(id: String) = Action {
    Ok(views.html.index())
  }

  def post(id: String) = Action {
    Ok(views.html.index())
  }

  def sitemap = Action {
    val entries = Entry.findAll(Published, 0, 10000)
    val sitemap =
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>http://kentenglish.ca/posts</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        {for (entry <- entries) yield {
        <url>
          <loc>http://kentenglish.ca/{entry.format.toString.toLowerCase}s/{entry.id}</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        }}
      </urlset>
    Ok(sitemap)
  }

}

