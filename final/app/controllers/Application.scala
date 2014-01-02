package controllers

import play.api._
import play.api.mvc._

import models.Entry
import models.EntryFormat._
import models.EntryStatus._

import java.text.SimpleDateFormat
import java.util.Locale

import scala.xml.XML._

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

  def rssDescription(entry: Entry) = {
    val pattern = """<h\d>([^<]+)<\/h\d>""".r
    pattern findFirstIn entry.html match {
      case Some(html) => loadString(html).text
      case None => ""
    }
  }

  def rss = Action {
    val posts = Entry.findAllByFormat(Post, Published, 0, 10000)
    val latest = posts.head
    val format = "E, d MMM yyyy HH:mm:ss Z"
    val pubDate = new SimpleDateFormat(format, Locale.CANADA).format(latest.created);
    val rss =

      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
          <title>Kent English</title>
          <description>The Blog of Kent English</description>
          <link>http://kentenglish.ca</link>
          <lastBuildDate>{pubDate}</lastBuildDate>
          <pubDate>{pubDate}</pubDate>
          <ttl>1800</ttl>
          <atom:link href="http://kentenglish.ca/rss.xml" rel="self" type="application/rss+xml" />
          {for (post <- posts) yield {
          <item>
            <title>{post.title}</title>
            <description>{rssDescription(post)}</description>
            <link>http://kentenglish.ca/posts/{post.id}</link>
            <guid>http://kentenglish.ca/posts/{post.id}</guid>
            <pubDate>{new SimpleDateFormat(format, Locale.CANADA).format(post.created)}</pubDate>
          </item>
          }}
        </channel>
      </rss>
    Ok(rss)
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

