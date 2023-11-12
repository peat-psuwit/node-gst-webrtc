#include "NgwNativePromise.h"

struct _NgwNativePromise
{
  GObject parent_instance;

  GstPromise * gst_promise;
};

G_DEFINE_TYPE(NgwNativePromise, ngw_native_promise, G_TYPE_OBJECT)

enum {
  SIGNAL_ON_CHANGED,
  LAST_SIGNAL,
};

static guint promise_signals[LAST_SIGNAL] = { 0 };

static void ngw_native_promise_dispose (GObject *);

static void
ngw_native_promise_class_init(NgwNativePromiseClass * klass)
{
  GObjectClass *object_class = G_OBJECT_CLASS (klass);

  object_class->dispose = ngw_native_promise_dispose;

  /**
   * NgwNativePromise::on-changed:
   * @object: the #NgwNativePromise
   */
  promise_signals[SIGNAL_ON_CHANGED] =
      g_signal_new ("on-changed", G_TYPE_FROM_CLASS (klass),
      G_SIGNAL_RUN_LAST, 0, NULL, NULL, NULL, G_TYPE_NONE, 0);
}

static void on_gst_promise_changed (GstPromise * promise, gpointer user_data);

static void
ngw_native_promise_init (NgwNativePromise * self)
{
  // XXX: will have to make sure JS side hold this object long enough.
  self->gst_promise = gst_promise_new_with_change_func(
    on_gst_promise_changed, /* user_data */ self, /* GDestroyNotify */ NULL);
}

static gboolean
handle_gst_promise_changed_on_idle (gpointer user_data)
{
  NgwNativePromise * self = NGW_NATIVE_PROMISE(user_data);

  g_signal_emit(self, promise_signals[SIGNAL_ON_CHANGED], /* detail */ 0);

  return G_SOURCE_REMOVE;
}

static void
on_gst_promise_changed (GstPromise * promise G_GNUC_UNUSED, gpointer user_data)
{
  NgwNativePromise * self = NGW_NATIVE_PROMISE(user_data);

  g_idle_add (handle_gst_promise_changed_on_idle, self);
}

/**
 * ngw_native_promise_get_gst_promise:
 * @self: the #NgwNativePromise
 *
 * Returns: (transfer none): the #GstPromise
 */
GstPromise *
ngw_native_promise_get_gst_promise (NgwNativePromise * self)
{
  return self->gst_promise;
}

static void
ngw_native_promise_dispose (GObject * gobject)
{
  NgwNativePromise * self = NGW_NATIVE_PROMISE(gobject);

  g_clear_pointer(&self->gst_promise, gst_promise_unref);
}

NgwNativePromise *
ngw_native_promise_new (void)
{
  return g_object_new (NGW_NATIVE_PROMISE_TYPE, NULL);
}
