#pragma once

#include <glib-object.h>
#include <gst/gstpromise.h>

#include "NgwNativeCommon.h"

G_BEGIN_DECLS

#define NGW_NATIVE_PROMISE_TYPE ngw_native_promise_get_type()
NGWNATIVE_PUBLIC G_DECLARE_FINAL_TYPE(
  NgwNativePromise,
  ngw_native_promise,
  NGW_NATIVE, PROMISE, GObject)

NGWNATIVE_PUBLIC
NgwNativePromise * ngw_native_promise_new(void);

NGWNATIVE_PUBLIC
GstPromise * ngw_native_promise_get_gst_promise(NgwNativePromise * self);

G_END_DECLS
