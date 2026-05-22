/* ==========================================================================
   卓フェス2026 ～サマーシーズン～ 特設サイト スクリプト
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. 設定・定数オブジェクト
    // ----------------------------------------------------------------------
    const CONFIG = {
        // Discord参加リンク（変更する場合はここを書き換えてください）
        discordLink: "https://discord.gg/xxxxxx",
        
        // 演出時間の調整 (ミリ秒)
        // prefers-reduced-motion が有効な場合は自動的に短縮されます
        fadeDuration: 500,        // フェード効果の基準時間
        introTitleDelay: 500,     // タイトル表示までの時間
        introCopyDelay: 1500,     // キャッチコピー表示までの時間
        whiteoutDelay: 3500,      // ホワイトアウト開始タイミング
        mainViewDelay: 4300,      // 通常コンテンツ表示開始タイミング
        finishDelay: 5100,        // 演出全終了（ホワイトアウト解除）タイミング
    };

    // ----------------------------------------------------------------------
    // 2. DOM要素の取得
    // ----------------------------------------------------------------------
    // 音声選択
    const audioOverlay = document.getElementById('audio-overlay');
    const btnAudioOn = document.getElementById('btn-audio-on');
    const btnAudioOff = document.getElementById('btn-audio-off');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    
    // オーディオ要素
    const summerAudio = document.getElementById('summer-audio');
    
    // 入場演出
    const introOverlay = document.getElementById('intro-overlay');
    const introTitle = document.getElementById('intro-title');
    const introCopy = document.getElementById('intro-copy');
    const whiteoutScreen = document.getElementById('whiteout-screen');
    
    // メインコンテンツ
    const mainContent = document.getElementById('main-content');
    
    // 固定音声コントロール
    const fixedAudioWidget = document.getElementById('fixed-audio-widget');
    const btnMuteToggle = document.getElementById('btn-mute-toggle');
    const widgetVolumeSlider = document.getElementById('widget-volume-slider');
    const iconSound = document.getElementById('icon-sound');
    const iconMute = document.getElementById('icon-mute');
    
    // 同意・参加ボタン
    const chkAgree = document.getElementById('chk-agree');
    const btnDiscord = document.getElementById('btn-discord');

    // ----------------------------------------------------------------------
    // 3. 状態管理変数
    // ----------------------------------------------------------------------
    let isMuted = false;
    let currentVolume = 0.4; // 各スライダー初期値40%に対応する 0.0〜1.0

    // ----------------------------------------------------------------------
    // 4. 初期化処理
    // ----------------------------------------------------------------------
    // Discordリンクの一元設定を反映
    if (btnDiscord) {
        btnDiscord.href = CONFIG.discordLink;
    }

    // 動きを抑える設定 (アクセシビリティ対応) の判定
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ----------------------------------------------------------------------
    // 5. 音量・ミュート関連関数
    // ----------------------------------------------------------------------
    // 音量適用
    function applyVolume(volumeFraction) {
        try {
            currentVolume = volumeFraction;
            if (summerAudio) {
                summerAudio.volume = volumeFraction;
            }
            
            // スライダーの数値を同期 (0〜100値)
            const percentValue = Math.round(volumeFraction * 100);
            
            if (volumeSlider) {
                volumeSlider.value = percentValue;
            }
            if (volumeValue) {
                volumeValue.textContent = `${percentValue}%`;
            }
            if (widgetVolumeSlider) {
                widgetVolumeSlider.value = percentValue;
            }

            // 0より大きければミュート解除、0ならミュート扱い
            if (volumeFraction > 0) {
                if (isMuted) {
                    setMuteState(false);
                }
            } else {
                if (!isMuted) {
                    setMuteState(true);
                }
            }
        } catch (err) {
            console.error("Error applying volume:", err);
        }
    }

    // ミュート状態の切り替え
    function setMuteState(mute) {
        try {
            isMuted = mute;
            if (summerAudio) {
                summerAudio.muted = mute;
            }

            if (mute) {
                if (iconSound) iconSound.classList.add('is-hidden');
                if (iconMute) iconMute.classList.remove('is-hidden');
                if (btnMuteToggle) {
                    btnMuteToggle.setAttribute('aria-label', '消音を解除する');
                    btnMuteToggle.setAttribute('title', 'ミュートを解除');
                }
            } else {
                if (iconSound) iconSound.classList.remove('is-hidden');
                if (iconMute) iconMute.classList.add('is-hidden');
                if (btnMuteToggle) {
                    btnMuteToggle.setAttribute('aria-label', '消音にする');
                    btnMuteToggle.setAttribute('title', 'ミュートにする');
                }
                
                // 音量が0のままでミュート解除された場合は、聴こえるように少し音量を上げる
                if (summerAudio && summerAudio.volume === 0) {
                    applyVolume(0.1);
                }
            }
        } catch (err) {
            console.error("Error setting mute state:", err);
        }
    }

    // 音量スライダー変更イベント
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value) / 100;
            applyVolume(val);
        });
    }

    if (widgetVolumeSlider) {
        widgetVolumeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value) / 100;
            applyVolume(val);
        });
    }

    // ミュートボタンクリック
    if (btnMuteToggle) {
        btnMuteToggle.addEventListener('click', () => {
            setMuteState(!isMuted);
        });
    }

    // ----------------------------------------------------------------------
    // 6. 入場演出シーケンス
    // ----------------------------------------------------------------------
    function startIntro(withAudio) {
        console.log("startIntro called. withAudio:", withAudio);

        // 音声の安全な再生（読み込めない場合やブロックされた場合も必ず次に進める）
        if (summerAudio) {
            if (withAudio) {
                summerAudio.play()
                    .then(() => {
                        console.log("Audio playback started successfully.");
                    })
                    .catch(error => {
                        console.warn("Audio auto-playback failed or blocked by browser:", error);
                        // 例外が発生しても無視して入場を続行
                    });
            } else {
                // 音なしの場合は消音状態に＆再生
                setMuteState(true);
                summerAudio.play().catch(() => {});
            }
        }

        // 音声選択オーバーレイを最前面から片付ける
        if (audioOverlay) {
            audioOverlay.style.opacity = '0';
            audioOverlay.style.pointerEvents = 'none';
        }
        
        setTimeout(() => {
            if (audioOverlay) {
                audioOverlay.classList.add('is-hidden');
                audioOverlay.setAttribute('aria-hidden', 'true');
            }
            
            // 入室演出オーバーレイを表示し、最前面に
            if (introOverlay) {
                introOverlay.classList.remove('is-hidden');
                introOverlay.setAttribute('aria-hidden', 'false');
                introOverlay.style.opacity = '1';
                introOverlay.style.pointerEvents = 'auto';
            }
            
            console.log("Audio overlay hidden. Starting timeline...");
            runIntroTimeline();
        }, CONFIG.fadeDuration);
    }

    // 演出のタイムライン制御
    function runIntroTimeline() {
        console.log("runIntroTimeline standard sequence started.");

        if (prefersReducedMotion) {
            console.log("Reduced motion preferred. Skipping animation.");
            setTimeout(() => {
                showMainContent();
            }, 500);
            return;
        }

        // 1. タイトル表示
        setTimeout(() => {
            console.log("Step 1: Show intro title");
            if (introTitle) introTitle.classList.add('show');
        }, CONFIG.introTitleDelay);

        // 2. キャッチコピー表示
        setTimeout(() => {
            console.log("Step 2: Show intro copy");
            if (introCopy) introCopy.classList.add('show');
        }, CONFIG.introCopyDelay);

        // 3. 画面が白い光でホワイトアウトする
        setTimeout(() => {
            console.log("Step 3: Whiteout screen start");
            if (whiteoutScreen) whiteoutScreen.classList.add('active');
        }, CONFIG.whiteoutDelay);

        // 4. メインコンテンツと音声ウィジェットを表示 & 演出画面の裏片付け
        setTimeout(() => {
            console.log("Step 4: Display main content (under background)");
            showMainContent();
        }, CONFIG.mainViewDelay);

        // 5. ホワイトアウト解除（フィニッシュ）
        setTimeout(() => {
            console.log("Step 5: Whiteout fade out. Finish intro.");
            if (whiteoutScreen) whiteoutScreen.classList.remove('active');
            
            // 不要になった演出用オーバーレイを完全に隠す
            if (introOverlay) {
                introOverlay.classList.add('is-hidden');
                introOverlay.setAttribute('aria-hidden', 'true');
            }
        }, CONFIG.finishDelay);
    }

    // メインコンテンツを表示する共通処理
    function showMainContent() {
        console.log("showMainContent custom function executing.");
        // スクロール制限を解除して、通常表示を可能にする
        document.body.classList.add('is-ready');

        // 演出画面から通常画面への移行
        if (mainContent) {
            mainContent.classList.remove('is-hidden');
            mainContent.setAttribute('aria-hidden', 'false');
            
            // 安全対策：一部のスマホ（省電力モード時等）で実行がスキップされる可能性がある requestAnimationFrame を
            // 互換性の極めて高い通常の setTimeout に置き換えて、確実にフェードインを起動させます
            setTimeout(() => {
                mainContent.classList.add('fade-in');
            }, 50);
        }

        // 固定表示の音声ウィジェットを表示
        if (fixedAudioWidget) {
            fixedAudioWidget.classList.remove('is-hidden');
            fixedAudioWidget.setAttribute('aria-hidden', 'false');
        }
    }

    // 音声選択ボタンイベント
    if (btnAudioOn) {
        btnAudioOn.addEventListener('click', () => {
            // 現在のスライダー値を取得して適用
            const initialVol = parseFloat(volumeSlider.value) / 100;
            applyVolume(initialVol);
            startIntro(true);
        });
    }

    if (btnAudioOff) {
        btnAudioOff.addEventListener('click', () => {
            startIntro(false);
        });
    }

    // ----------------------------------------------------------------------
    // 7. 同意チェックボックス & Discord参加ボタン連動
    // ----------------------------------------------------------------------
    if (chkAgree && btnDiscord) {
        chkAgree.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            
            if (isChecked) {
                // 有効化
                btnDiscord.classList.remove('disabled');
                btnDiscord.classList.add('pulse'); // 連動して目を惹くエフェクトを追加
                btnDiscord.setAttribute('aria-disabled', 'false');
                btnDiscord.removeAttribute('tabindex'); // フォーカス可能にする
            } else {
                // 無効化
                btnDiscord.classList.add('disabled');
                btnDiscord.classList.remove('pulse');
                btnDiscord.setAttribute('aria-disabled', 'true');
                btnDiscord.setAttribute('tabindex', '-1'); // キーボードナビゲーションから外す
            }
        });

        // キーボード操作対策 (EnterキーやSpaceキーによる誤遷移防止)
        btnDiscord.addEventListener('click', (e) => {
            if (btnDiscord.classList.contains('disabled')) {
                e.preventDefault();
            }
        });
    }
});
