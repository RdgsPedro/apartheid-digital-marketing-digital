/* Aviso de cookies + Google Analytics 4 (GA4)
 *
 * O Google só é chamado depois que a pessoa clica em "Aceitar".
 * Sem escolha, ou com "Recusar", nenhuma conexão com o Google é aberta.
 * A escolha fica só no navegador (localStorage), vale por 12 meses e pode ser
 * mudada no botão "Preferências de cookies" do rodapé.
 *
 * Para trocar de propriedade do Analytics, mude apenas GA_ID.
 */
(function () {
    'use strict';

    const GA_ID = 'G-TZY4QKCGTE';
    const KEY = 'ad_consent';
    const VALID_MS = 365 * 24 * 60 * 60 * 1000;
    const POLICY_URL = 'politica-de-privacidade.html';

    let memory = null;        // guarda a escolha só nesta aba, se o localStorage estiver bloqueado
    let allowed = false;      // true = a pessoa aceitou
    let gaLoaded = false;
    let banner = null;
    let opener = null;        // botão do rodapé que reabriu o aviso (para devolver o foco)
    let sectionObserver = null;

    /* ---------- escolha guardada ---------- */
    function readChoice() {
        let raw = null;
        try { raw = localStorage.getItem(KEY); } catch (err) { return memory; }
        if (!raw) return memory;
        try {
            const c = JSON.parse(raw);
            if (c && typeof c.analytics === 'boolean' && c.ts && Date.now() - c.ts < VALID_MS) return c;
        } catch (err) { /* valor inválido: pergunta de novo */ }
        return null;
    }

    function saveChoice(analytics) {
        memory = { analytics: analytics, ts: Date.now() };
        try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch (err) { /* segue só em memória */ }
    }

    /* ---------- Google Analytics ---------- */
    function enable() {
        allowed = true;
        window['ga-disable-' + GA_ID] = false;
        if (gaLoaded) {
            window.gtag('consent', 'update', { analytics_storage: 'granted' });
        } else {
            gaLoaded = true;
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () { window.dataLayer.push(arguments); };
            window.gtag('consent', 'default', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
            });
            window.gtag('js', new Date());
            window.gtag('config', GA_ID, {
                allow_google_signals: false,
                allow_ad_personalization_signals: false,
                cookie_flags: 'SameSite=Lax;Secure',
                cookie_expires: 31536000
            });
            const s = document.createElement('script');
            s.async = true;
            s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
            document.head.appendChild(s);
        }
        watchSections();
    }

    function disable() {
        allowed = false;
        window['ga-disable-' + GA_ID] = true;
        if (gaLoaded) window.gtag('consent', 'update', { analytics_storage: 'denied' });
        if (sectionObserver) { sectionObserver.disconnect(); sectionObserver = null; }
        deleteGaCookies();
    }

    function deleteGaCookies() {
        const past = 'Thu, 01 Jan 1970 00:00:00 GMT';
        const host = location.hostname;
        document.cookie.split(';').forEach(function (c) {
            const name = c.split('=')[0].trim();
            if (name !== '_ga' && name.indexOf('_ga_') !== 0) return;
            ['', '; domain=' + host, '; domain=.' + host].forEach(function (domain) {
                document.cookie = name + '=; expires=' + past + '; path=/' + domain + '; SameSite=Lax';
            });
        });
    }

    /* ---------- eventos (só enviados com consentimento) ---------- */
    function track(name, params) {
        if (allowed && window.gtag) window.gtag('event', name, params || {});
    }

    function clip(text) {
        return String(text || '').replace(/\s+/g, ' ').trim().slice(0, 90);
    }

    function whereIs(el) {
        const sec = el.closest('section[id]');
        if (sec) return sec.id;
        if (el.closest('footer')) return 'rodape';
        return el.closest('header') ? 'cabecalho' : 'outro';
    }

    document.addEventListener('click', function (e) {
        if (!allowed || !e.target.closest) return;
        const el = e.target;

        const link = el.closest('a[href]');
        if (link) {
            const href = link.getAttribute('href') || '';
            const host = link.hostname || '';
            const where = whereIs(link);
            if (href.indexOf('mailto:') === 0) track('clique_email', { local: where });
            else if (/(^|\.)cetic\.br$/.test(host)) track('clique_microdados', { local: where });
            else if (host === 'github.com') track('clique_github', { local: where });
            else if (/(^|\.)linkedin\.com$/.test(host)) track('clique_linkedin', { local: where });
            else if (host && host !== location.hostname) track('clique_externo', { destino: host, local: where });
            return;
        }

        const tab = el.closest('[role="tab"]');
        if (tab) { track('abrir_aba', { aba: clip(tab.textContent).replace(/^\d+\s*/, '') }); return; }

        const copy = el.closest('[data-copy]');
        if (copy) { track('copiar_referencia', { referencia: String(copy.dataset.copy).replace('cite-', '') }); return; }

        const fig = el.closest('.fig-frame');
        if (fig && !fig.classList.contains('is-empty')) {
            const n = /Figura\s*(\d+)/.exec(fig.getAttribute('aria-label') || '');
            track('abrir_figura', { figura: n ? n[1] : 'outra' });
        }
    });

    /* pergunta do FAQ aberta (o evento "toggle" não sobe, por isso a captura) */
    document.addEventListener('toggle', function (e) {
        const d = e.target;
        if (allowed && d.matches && d.matches('details.faq') && d.open) {
            const q = d.querySelector('h3');
            track('faq_aberta', { pergunta: clip(q && q.textContent) });
        }
    }, true);

    /* seção que chegou ao meio da tela (uma vez por seção) */
    function watchSections() {
        if (sectionObserver || !('IntersectionObserver' in window)) return;
        const seen = {};
        sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting && !seen[en.target.id]) {
                    seen[en.target.id] = true;
                    track('ver_secao', { secao: en.target.id });
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        document.querySelectorAll('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
    }

    /* ---------- aviso ---------- */
    function buildBanner() {
        if (banner) return banner;
        banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-modal', 'false');
        banner.setAttribute('aria-labelledby', 'cookieTitle');
        banner.setAttribute('aria-describedby', 'cookieText');
        banner.hidden = true;
        banner.innerHTML =
            '<div class="cookie-in">' +
              '<div class="cookie-text">' +
                '<p class="cookie-title" id="cookieTitle">Cookies de estatística</p>' +
                '<p id="cookieText">Usamos o Google Analytics para saber quais partes do site são mais lidas. ' +
                  'Ele só é ativado se você aceitar, e você pode mudar de ideia quando quiser. ' +
                  'Detalhes na <a href="' + POLICY_URL + '">política de privacidade</a>.</p>' +
                '<p class="cookie-state" id="cookieState" hidden></p>' +
              '</div>' +
              '<div class="cookie-actions">' +
                '<button type="button" class="cookie-btn" data-cookie="no">Recusar</button>' +
                '<button type="button" class="cookie-btn" data-cookie="yes">Aceitar</button>' +
              '</div>' +
            '</div>';
        banner.addEventListener('click', function (e) {
            const btn = e.target.closest('[data-cookie]');
            if (!btn) return;
            const yes = btn.dataset.cookie === 'yes';
            saveChoice(yes);
            if (yes) enable(); else disable();
            hideBanner();
        });
        document.body.insertBefore(banner, document.body.firstChild);
        return banner;
    }

    function showBanner(reopen) {
        buildBanner();
        const state = banner.querySelector('#cookieState');
        const c = readChoice();
        if (reopen && c) {
            state.textContent = 'Sua escolha atual: ' + (c.analytics ? 'aceitou.' : 'recusou.');
            state.hidden = false;
        } else {
            state.hidden = true;
        }
        banner.hidden = false;
        if (reopen) banner.querySelector('[data-cookie]').focus();
    }

    function hideBanner() {
        if (!banner) return;
        banner.hidden = true;
        if (opener) { opener.focus(); opener = null; }
    }

    document.addEventListener('click', function (e) {
        const open = e.target.closest && e.target.closest('[data-cookie-open]');
        if (!open) return;
        opener = open;
        showBanner(true);
    });

    document.addEventListener('keydown', function (e) {
        /* Esc fecha o aviso reaberto, mantendo a escolha que já existia */
        if (e.key === 'Escape' && banner && !banner.hidden && readChoice()) hideBanner();
    });

    function init() {
        const choice = readChoice();
        if (choice && choice.analytics) enable();
        if (choice) return;
        /* espera a página carregar, para o aviso não competir com o conteúdo */
        const ask = function () { setTimeout(function () { if (!readChoice()) showBanner(false); }, 600); };
        if (document.readyState === 'complete') ask(); else window.addEventListener('load', ask);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
