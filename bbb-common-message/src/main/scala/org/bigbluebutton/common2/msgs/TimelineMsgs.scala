package org.bigbluebutton.common2.msgs

/* In Messages */
object ActivateTimelineReqMsg { val NAME = "ActivateTimelineReqMsg" }
case class ActivateTimelineReqMsg(header: BbbClientMsgHeader, body: ActivateTimelineReqMsgBody) extends StandardMsg
case class ActivateTimelineReqMsgBody()

/* Out Messages */
object ActivateTimelineRespMsg { val NAME = "ActivateTimelineRespMsg" }
case class ActivateTimelineRespMsg(header: BbbCoreHeaderWithMeetingId, body: ActivateTimelineRespMsgBody) extends BbbCoreMsg
case class ActivateTimelineRespMsgBody()
