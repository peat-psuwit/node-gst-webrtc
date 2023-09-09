#pragma once

#include <glib-object.h>

#define GST_USE_UNSTABLE_API
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

  /* TODO: introspection for vfuncs? */
  void (* handle_buffered_amount_low) (NgwNativeRTCDataChannel * self);
  void (* handle_close) (NgwNativeRTCDataChannel * self);
  void (* handle_error) (NgwNativeRTCDataChannel * self,
                         GError * error);
  void (* handle_message_data) (NgwNativeRTCDataChannel * self,
                                GBytes * bytes);
  void (* handle_message_string) (NgwNativeRTCDataChannel * self,
                                 const char * string);
  void (* handle_open) (NgwNativeRTCDataChannel * self);
};

NGWNATIVE_PUBLIC
NgwNativeRTCDataChannel * ngw_native_rtc_data_channel_new(
  GstWebRTCDataChannel * gstdatachannel
);

G_END_DECLS
