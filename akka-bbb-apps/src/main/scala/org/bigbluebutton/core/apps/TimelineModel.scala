package org.bigbluebutton.core.apps

object TimelineModel {
  def createTimeline(model: TimelineModel): Unit = {}

  // def reset(model: TimelineModel): Unit = {
  //   model.isActive = false
  // }

  def setIsActive(model: TimelineModel, active: Boolean): Unit = {
    model.isActive = active
  }

  def getIsActive(model: TimelineModel): Boolean = {
    model.isActive
  }
}

class TimelineModel {
  private var isActive: Boolean = false
}
