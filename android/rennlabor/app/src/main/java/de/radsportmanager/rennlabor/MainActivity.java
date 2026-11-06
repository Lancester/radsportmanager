package de.radsportmanager.rennlabor;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import androidx.webkit.WebViewAssetLoader;

public final class MainActivity extends Activity {
    private WebView browser;

    @Override
    @SuppressWarnings("SetJavaScriptEnabled")
    public void onCreate(Bundle state) {
        super.onCreate(state);
        browser = new WebView(this);
        browser.setBackgroundColor(0xff0a1422);
        browser.getSettings().setJavaScriptEnabled(true);
        browser.getSettings().setDomStorageEnabled(true);
        browser.getSettings().setAllowFileAccess(false);
        browser.getSettings().setAllowContentAccess(false);
        browser.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
            .setDomain("appassets.androidplatform.net")
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();
        browser.setWebViewClient(new WebViewClient() {
            @Override
            public android.webkit.WebResourceResponse shouldInterceptRequest(
                WebView view, WebResourceRequest request) {
                // Nur gebündelte lokale Dateien werden ausgegeben; die
                // Android-App besitzt keine INTERNET-Berechtigung.
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                android.net.Uri uri = request.getUrl();
                return !"appassets.androidplatform.net".equals(uri.getHost()) ||
                  !uri.getPath().startsWith("/assets/labor/");
            }
        });
        browser.setWebChromeClient(new WebChromeClient());
        setContentView(browser);
        browser.loadUrl("https://appassets.androidplatform.net/assets/labor/index.html");
    }
    @Override
    public void onBackPressed() {
        if(browser!=null&&browser.canGoBack())browser.goBack();
        else super.onBackPressed();
    }
    @Override
    protected void onDestroy() {
        if(browser!=null)browser.destroy();
        super.onDestroy();
    }
}
