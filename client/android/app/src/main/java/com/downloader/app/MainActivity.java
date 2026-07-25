package com.downloader.app;

import android.graphics.Color;
import android.os.Bundle;
import android.util.TypedValue;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;
import com.google.android.material.color.DynamicColors;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Enable Dynamic Colors (Material You)
        DynamicColors.applyToActivityIfAvailable(this);
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onResume() {
        super.onResume();
        // Push colors immediately
        updateWebTheme();
        // Push colors again after 2 seconds to ensure React is ready
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().postDelayed(this::updateWebTheme, 2000);
            getBridge().getWebView().postDelayed(this::updateWebTheme, 5000);
        }
    }

    private void updateWebTheme() {
        if (getBridge() == null || getBridge().getWebView() == null) return;

        WebView webView = getBridge().getWebView();
        
        try {
            JSONObject colors = new JSONObject();
            colors.put("primary", hexColor(com.google.android.material.R.attr.colorPrimary));
            colors.put("secondary", hexColor(com.google.android.material.R.attr.colorSecondary));
            colors.put("accent", hexColor(com.google.android.material.R.attr.colorTertiary));
            colors.put("background", hexColor(com.google.android.material.R.attr.colorSurface));
            colors.put("surface", hexColor(com.google.android.material.R.attr.colorSurfaceVariant));
            colors.put("text", hexColor(com.google.android.material.R.attr.colorOnSurface));

            String js = "if (window.updateDynamicColors) { window.updateDynamicColors(" + colors.toString() + "); }";
            webView.post(() -> webView.evaluateJavascript(js, null));
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private String hexColor(int attrRes) {
        TypedValue typedValue = new TypedValue();
        if (getTheme().resolveAttribute(attrRes, typedValue, true)) {
            int color = typedValue.data;
            return String.format("#%06X", (0xFFFFFF & color));
        }
        return "#000000";
    }
}
