import sbt._

object Version {
  val scala         = "2.10.3"
  val actuarius     = "0.2.6"
  val postgresql    = "9.1-901.jdbc4"
}

object Library {
  val actuarius     = "eu.henkelmann" % "actuarius_2.10.0"  % Version.actuarius
  val postgresql    = "postgresql"    % "postgresql"        % Version.postgresql
}

object Dependencies {
  import Library._

  val app = List(
    actuarius,
    postgresql
  )
}