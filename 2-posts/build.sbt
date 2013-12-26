name := "snapp-stack-blog"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache
)

libraryDependencies ++= Dependencies.app

play.Project.playScalaSettings
