import sbt._

object Version {
  val scala         = "2.10.3"
  val actuarius     = "0.2.6"
  val knockoff      = "0.8.2"
  val postgresql    = "9.1-901.jdbc4"
}

object Library {
  val actuarius     = "eu.henkelmann"   % "actuarius_2.10.0"  % Version.actuarius
  val knockoff      = "com.tristanhunt" %% "knockoff"         % Version.knockoff
  val postgresql    = "postgresql"      % "postgresql"        % Version.postgresql
}

object Dependencies {
  import Library._

  val app = List(
    actuarius,
    knockoff,
    postgresql
  )
}

