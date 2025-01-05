package org.bigbluebutton.core.apps.timeline

import org.apache.pekko.actor.ActorContext
import org.apache.pekko.event.Logging

class TimelineApp3x(implicit val context: ActorContext)
  extends ActivateTimelineReqMsgHdlr {

  val log = Logging(context.system, getClass)
}
