// Android WebView 전체 화면 설정 예시 (Kotlin)

import android.os.Build
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    
    private lateinit var webView: WebView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        webView = findViewById(R.id.webview)
        setupFullscreenWebView()
    }
    
    private fun setupFullscreenWebView() {
        // API 30+ (Android 11+) - WindowInsetsController 사용
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(false)
            window.insetsController?.let { controller ->
                // 시스템 바 숨김
                controller.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
                // 시스템 바가 나타날 때 레이아웃 조정
                controller.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            // API 30 미만 - 기존 방식 사용
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            )
        }
        
        // WebView 설정
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
        }
        
        // 웹뷰 로드
        webView.loadUrl("https://reconnect-ivory.vercel.app")
        
        // JavaScript 인터페이스 추가 (필요시)
        webView.addJavascriptInterface(WebAppInterface(), "Android")
    }
    
    // JavaScript에서 호출할 수 있는 네이티브 함수들
    inner class WebAppInterface {
        @android.webkit.JavascriptInterface
        fun enableFullscreen() {
            runOnUiThread {
                setupFullscreenWebView()
            }
        }
        
        @android.webkit.JavascriptInterface
        fun getSafeAreaInsets(): String {
            val displayMetrics = resources.displayMetrics
            val statusBarHeight = getStatusBarHeight()
            val navigationBarHeight = getNavigationBarHeight()
            
            return """
            {
                "top": $statusBarHeight,
                "bottom": $navigationBarHeight,
                "left": 0,
                "right": 0
            }
            """.trimIndent()
        }
        
        private fun getStatusBarHeight(): Int {
            val resourceId = resources.getIdentifier("status_bar_height", "dimen", "android")
            return if (resourceId > 0) resources.getDimensionPixelSize(resourceId) else 0
        }
        
        private fun getNavigationBarHeight(): Int {
            val resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android")
            return if (resourceId > 0) resources.getDimensionPixelSize(resourceId) else 0
        }
    }
    
    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            setupFullscreenWebView()
        }
    }
}