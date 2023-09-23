#pragma once

#include <glib-object.h>

#ifndef GST_USE_UNSTABLE_API
#define GST_USE_UNSTABLE_API
#endif
#include <gst/webrtc/webrtc_fwd.h>

#include "NgwNativeCommon.h"

G_BEGIN_DECLS

/*
 * Type declaration.
 */
#define NGW_NATIVE_RTC_DATA_CHANNEL_TYPE ngw_native_rtc_data_channel_get_type()

NGWNATIVE_PUBLIC G_DECLARE_DERIVABLE_TYPE(
  NgwNativeRTCDataChannel,
  ngw_native_rtc_data_channel,
  NGW_NATIVE, RTC_DATA_CHANNEL, GObject)

struct _NgwNativeRTCDataChannelClass {
  GObjectClass parent_class;
};

NGWNATIVE_PUBLIC
NgwNativeRTCDataChannel * ngw_native_rtc_data_channel_new(
  GstWebRTCDataChannel * gstdatachannel
);

G_END_DECLS
