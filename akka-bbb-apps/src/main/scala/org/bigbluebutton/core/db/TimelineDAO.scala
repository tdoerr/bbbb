package org.bigbluebutton.core.db

import org.bigbluebutton.core.apps.TimelineModel
import org.bigbluebutton.core.apps.TimelineModel.{getIsActive}
import slick.jdbc.PostgresProfile.api._

case class TimelineDbModel(
    meetingId: String,
    active:    Boolean,
)

class TimelineDbTableDef(tag: Tag) extends Table[TimelineDbModel](tag, None, "timeline") {
  val meetingId = column[String]("meetingId", O.PrimaryKey)
  val active = column[Boolean]("active")
  override def * = (meetingId, active) <> (TimelineDbModel.tupled, TimelineDbModel.unapply)
}

object TimelineDAO {
  def insert(meetingId: String, model: TimelineModel) = {
    DatabaseConnection.enqueue(
      TableQuery[TimelineDbTableDef].insertOrUpdate(
        TimelineDbModel(
          meetingId = meetingId,
          active = getIsActive(model),
        )
      )
    )
  }

  def update(meetingId: String, timelineModel: TimelineModel) = {
    DatabaseConnection.enqueue(
      TableQuery[TimelineDbTableDef]
        .filter(_.meetingId === meetingId)
        .map(t => (t.active))
        .update(
          (getIsActive(timelineModel))
        )
    )
  }
}
