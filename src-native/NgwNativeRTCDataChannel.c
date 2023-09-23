#include <glib.h>
#include <gst/gst.h>

#define GST_USE_UNSTABLE_API
#include <gst/webrtc/datachannel.h>

#include "NgwNativeRTCDataChannel.h"

typedef struct {
  GstWebRTCDataChannel *gstdatachannel;
} NgwNativeRTCDataChannelPrivate;

G_DEFINE_TYPE_WITH_PRIVATE(
  NgwNativeRTCDataChannel,
  ngw_native_rtc_data_channel,
  G_TYPE_OBJECT)

enum
{
  SIGNAL_ON_OPEN,
  SIGNAL_ON_CLOSE,
  SIGNAL_ON_ERROR,
  SIGNAL_ON_MESSAGE_DATA,
  SIGNAL_ON_MESSAGE_STRING,
  SIGNAL_ON_BUFFERED_AMOUNT_LOW,
  LAST_SIGNAL,
};

enum {
  PROP_GSTDATACHANNEL = 1,
  N_PROPERTIES
};

static guint datachannel_signals[LAST_SIGNAL] = { 0 };

static GParamSpec *obj_properties[N_PROPERTIES] = { NULL, };

static void ngw_native_rtc_data_channel_set_property(
  GObject *, guint, const GValue *, GParamSpec *);
static void ngw_native_rtc_data_channel_get_property(
  GObject *, guint, GValue *, GParamSpec *);
static void ngw_native_rtc_data_channel_constructed(GObject *);
static void ngw_native_rtc_data_channel_dispose(GObject *);

static void ngw_native_rtc_data_channel_class_init(
  NgwNativeRTCDataChannelClass * klass)
{
  GObjectClass *object_class = G_OBJECT_CLASS (klass);

  object_class->set_property = ngw_native_rtc_data_channel_set_property;
  object_class->get_property = ngw_native_rtc_data_channel_get_property;
  object_class->constructed = ngw_native_rtc_data_channel_constructed;
  object_class->dispose = ngw_native_rtc_data_channel_dispose;

  obj_properties[PROP_GSTDATACHANNEL] = 
    g_param_spec_object("gst-data-channel",
                        "Gstreamer data channel",
                        "Underlying GstWebRTCDataChannel",
                        GST_TYPE_WEBRTC_DATA_CHANNEL,
                        G_PARAM_CONSTRUCT_ONLY | G_PARAM_READWRITE);
  g_object_class_install_properties(object_class, N_PROPERTIES, obj_properties);

  /**
   * NgwNativeRTCDataChannel::on-open:
   * @object: the #NgwNativeRTCDataChannel
   */
  datachannel_signals[SIGNAL_ON_OPEN] =
      g_signal_new ("on-open", G_TYPE_FROM_CLASS (klass),
      G_SIGNAL_RUN_LAST, 0, NULL, NULL, NULL, G_TYPE_NONE, 0);

  /**
   * NgwNativeRTCDataChannel::on-close:
   * @object: the #NgwNativeRTCDataChannel
   */
  datachannel_signals[SIGNAL_ON_CLOSE] =
      g_signal_new ("on-close", G_TYPE_FROM_CLASS (klass),
      G_SIGNAL_RUN_LAST, 0, NULL, NULL, NULL, G_TYPE_NONE, 0);

  /**
   * NgwNativeRTCDataChannel::on-error:
   * @object: the #NgwNativeRTCDataChannel
   * @error: the #GError thrown
   */
  datachannel_signals[SIGNAL_ON_ERROR] =
      g_signal_new ("on-error", G_TYPE_FROM_CLASS (klass),
      G_SIGNAL_RUN_LAST, 0, NULL, NULL, NULL, G_TYPE_NONE, 1, G_TYPE_ERROR);

  /**
   * NgwNativeRTCDataChannel::on-message-data:
   * @object: the #NgwNativeRTCDataChannel
   * @data: (nullable): a #GBytes of the data received
   */
  datachannel_signals[SIGNAL_ON_MESSAGE_DATA] =
      g_signal_new ("on-message-data", G_TYPE_FROM_CLASS (klass),
      G_SIGNAL_RUN_LAST, 0, NULL, NULL, NULL, G_TYPE_NONE, 1, G_TYPE_BYTES);

  /**
   * NgwNativeRTCDataChannel::on-message-string:
   * @object: the #NgwNativeRTCDataChannel
   * @data: (nullable): the data received as a string
   */
  datachannel_signals[SIGNAL_ON_MESSAGE_STRING] =
      g_signal_new ("on-message-string", G_TYPE_FROM_CLASS (klass),
      G_SIGNAL_RUN_LAST, 0, NULL, NULL, NULL, G_TYPE_NONE, 1, G_TYPE_STRING);

  /**
   * NgwNativeRTCDataChannel::on-buffered-amount-low:
   * @object: the #NgwNativeRTCDataChannel
   */
  datachannel_signals[SIGNAL_ON_BUFFERED_AMOUNT_LOW] =
      g_signal_new ("on-buffered-amount-low", G_TYPE_FROM_CLASS (klass),
      G_SIGNAL_RUN_LAST, 0, NULL, NULL, NULL, G_TYPE_NONE, 0);
}

static void ngw_native_rtc_data_channel_init(
  NgwNativeRTCDataChannel * self)
{
  NgwNativeRTCDataChannelPrivate * priv = ngw_native_rtc_data_channel_get_instance_private(self);

  priv->gstdatachannel = NULL;
}

static void ngw_native_rtc_data_channel_set_property(
  GObject      *object,
  guint         property_id,
  const GValue *value,
  GParamSpec   *pspec)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(object);
  NgwNativeRTCDataChannelPrivate * priv = ngw_native_rtc_data_channel_get_instance_private(self);

  switch (property_id) {
    case PROP_GSTDATACHANNEL:
      if (priv->gstdatachannel) // ???
        g_object_unref(priv->gstdatachannel);

      priv->gstdatachannel = g_value_dup_object(value);
      break;

    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

static void ngw_native_rtc_data_channel_get_property(
  GObject    *object,
  guint       property_id,
  GValue     *value,
  GParamSpec *pspec)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(object);
  NgwNativeRTCDataChannelPrivate * priv = ngw_native_rtc_data_channel_get_instance_private(self);

  switch (property_id) {
    case PROP_GSTDATACHANNEL:
      g_value_set_object(value, priv->gstdatachannel);
      break;

    default:
      G_OBJECT_WARN_INVALID_PROPERTY_ID (object, property_id, pspec);
      break;
  }
}

static void on_buffered_amount_low_callback(
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  gpointer user_data);
static void on_close_callback(
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  gpointer user_data);
static void on_error_callback(
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  GError * error,
  gpointer user_data);
static void on_message_data_callback (
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  GBytes * bytes,
  gpointer user_data);
static void on_message_string_callback (
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  gchar * string,
  gpointer user_data);
static void on_open_callback(
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  gpointer user_data);

static void ngw_native_rtc_data_channel_constructed(GObject * object)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(object);
  NgwNativeRTCDataChannelPrivate * priv = ngw_native_rtc_data_channel_get_instance_private(self);

  g_object_connect(priv->gstdatachannel,
    "signal::on-buffered-amount-low", on_buffered_amount_low_callback, self,
    "signal::on-close", on_close_callback, self,
    "signal::on-error", on_error_callback, self,
    "signal::on-message-data", on_message_data_callback, self,
    "signal::on-message-string", on_message_string_callback, self,
    "signal::on-open", on_open_callback, self,
    NULL);

  G_OBJECT_CLASS(ngw_native_rtc_data_channel_parent_class)->constructed(object);
}

static void ngw_native_rtc_data_channel_dispose(GObject * object)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(object);
  NgwNativeRTCDataChannelPrivate * priv = ngw_native_rtc_data_channel_get_instance_private(self);

  g_signal_handlers_disconnect_by_data(priv->gstdatachannel, self);
  g_clear_object(&priv->gstdatachannel);
}

static int ngw_native_rtc_data_channel_on_buffered_amount_low(gpointer user_data)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(user_data);

  g_signal_emit(self, datachannel_signals[SIGNAL_ON_BUFFERED_AMOUNT_LOW], 0);

  g_object_unref(self);
  return G_SOURCE_REMOVE;
}

static void on_buffered_amount_low_callback(
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  gpointer user_data)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(user_data);

  g_idle_add(
    ngw_native_rtc_data_channel_on_buffered_amount_low,
    g_object_ref(self));
}

static int ngw_native_rtc_data_channel_on_close(gpointer user_data)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(user_data);

  g_signal_emit(self, datachannel_signals[SIGNAL_ON_CLOSE], 0, NULL);

  g_object_unref(self);
  return G_SOURCE_REMOVE;
}

static void on_close_callback(
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  gpointer user_data)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(user_data);

  g_idle_add(
    ngw_native_rtc_data_channel_on_close,
    g_object_ref(self));
}

struct OnErrorData {
  NgwNativeRTCDataChannel * self;
  GError * error;
};

static int ngw_native_rtc_data_channel_on_error(gpointer user_data)
{
  struct OnErrorData * data = user_data;

  g_signal_emit(data->self,
      datachannel_signals[SIGNAL_ON_ERROR], 0, data->error);

  g_error_free(data->error);
  g_object_unref(data->self);
  g_free(data);

  return G_SOURCE_REMOVE;
}

static void on_error_callback(
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  GError * error,
  gpointer user_data)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(user_data);

  struct OnErrorData * data = g_new(struct OnErrorData, 1);
  *data = (struct OnErrorData) {
    .self = g_object_ref(self),
    .error = g_error_copy(error),
  };

  g_idle_add(ngw_native_rtc_data_channel_on_error, data);
}

struct OnMessageDataData {
  NgwNativeRTCDataChannel * self;
  GBytes * bytes;
};

static int ngw_native_rtc_data_channel_on_message_data(gpointer user_data)
{
  struct OnMessageDataData * data = user_data;  

  g_signal_emit(data->self,
      datachannel_signals[SIGNAL_ON_MESSAGE_DATA], 0, data->bytes);

  g_bytes_unref(data->bytes);
  g_object_unref(data->self);
  g_free(data);

  return G_SOURCE_REMOVE;
}

static void on_message_data_callback (
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  GBytes * bytes,
  gpointer user_data)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(user_data);

  struct OnMessageDataData * data = g_new(struct OnMessageDataData, 1);
  *data = (struct OnMessageDataData) {
    .self = g_object_ref(self),
    .bytes = g_bytes_ref(bytes),
  };

  g_idle_add(ngw_native_rtc_data_channel_on_message_data, data);
}

struct OnMessageStringData {
  NgwNativeRTCDataChannel * self;
  gchar * string;
};

static int ngw_native_rtc_data_channel_on_message_string(gpointer user_data)
{
  struct OnMessageStringData * data = user_data;

  g_signal_emit(data->self,
      datachannel_signals[SIGNAL_ON_MESSAGE_STRING], 0, data->string);

  g_free(data->string);
  g_object_unref(data->self);
  g_free(data);

  return G_SOURCE_REMOVE;
}

static void on_message_string_callback (
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  gchar * string,
  gpointer user_data)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(user_data);

  struct OnMessageStringData * data = g_new(struct OnMessageStringData, 1);
  *data = (struct OnMessageStringData) {
    .self = g_object_ref(self),
    .string = g_strdup(string),
  };

  g_idle_add(ngw_native_rtc_data_channel_on_message_string, data);
}

static int ngw_native_rtc_data_channel_on_open(gpointer user_data)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(user_data);

  g_signal_emit (self, datachannel_signals[SIGNAL_ON_OPEN], 0, NULL);

  g_object_unref(self);
  return G_SOURCE_REMOVE;
}

static void on_open_callback(
  GstWebRTCDataChannel * datachannel G_GNUC_UNUSED,
  gpointer user_data)
{
  NgwNativeRTCDataChannel * self = NGW_NATIVE_RTC_DATA_CHANNEL(user_data);

  g_idle_add(
    ngw_native_rtc_data_channel_on_open,
    g_object_ref(self));
}

/**
 * ngw_native_rtc_data_channel_new
 * @gstdatachannel: underlying GstWebRTCDataChannel
 *
 * Returns: (transfer full): new instance
 */
NgwNativeRTCDataChannel * ngw_native_rtc_data_channel_new(
  GstWebRTCDataChannel * gstdatachannel
)
{
  return g_object_new(
    NGW_NATIVE_RTC_DATA_CHANNEL_TYPE,
    "gst-data-channel", gstdatachannel,
    NULL
  );
}
