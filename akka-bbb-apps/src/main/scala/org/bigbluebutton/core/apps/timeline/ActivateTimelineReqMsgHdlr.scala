package org.bigbluebutton.core.apps.timeline

import org.bigbluebutton.common2.msgs._
import org.bigbluebutton.core.bus.MessageBus
import org.bigbluebutton.core.running.LiveMeeting
import org.bigbluebutton.core.apps.{ PermissionCheck, RightsManagementTrait, TimelineModel }
import org.bigbluebutton.core.db.TimelineDAO

trait ActivateTimelineReqMsgHdlr extends RightsManagementTrait {
  this: TimelineApp3x =>

  def handle(msg: ActivateTimelineReqMsg, liveMeeting: LiveMeeting, bus: MessageBus): Unit = {
    log.debug("Received ActivateTimelineReqMsg {}", ActivateTimelineReqMsg)
    def broadcastEvent(): Unit = {
      val routing = collection.immutable.HashMap("sender" -> "bbb-apps-akka")
      val envelope = BbbCoreEnvelope(ActivateTimelineRespMsg.NAME, routing)
      val header = BbbCoreHeaderWithMeetingId(
        ActivateTimelineRespMsg.NAME,
        liveMeeting.props.meetingProp.intId
      )
      val body = ActivateTimelineRespMsgBody()
      val event = ActivateTimelineRespMsg(header, body)
      val msgEvent = BbbCommonEnvCoreMsg(envelope, event)
      bus.outGW.send(msgEvent)
    }

    if (permissionFailed(PermissionCheck.MOD_LEVEL, PermissionCheck.VIEWER_LEVEL, liveMeeting.users2x, msg.header.userId) &&
      permissionFailed(PermissionCheck.GUEST_LEVEL, PermissionCheck.PRESENTER_LEVEL, liveMeeting.users2x, msg.header.userId)) {
      val meetingId = liveMeeting.props.meetingProp.intId
      val reason = "You need to be the presenter or moderator to activate timeline"
      PermissionCheck.ejectUserForFailedPermission(meetingId, msg.header.userId, reason, bus.outGW, liveMeeting)
    } else {
      // TimelineModel.reset(liveMeeting.timelineModel)
      TimelineModel.setIsActive(liveMeeting.timelineModel, true)
      TimelineDAO.update(liveMeeting.props.meetingProp.intId, liveMeeting.timelineModel)
      broadcastEvent()
    }
  }
}
