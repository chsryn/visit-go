<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>{{ config('app.name', 'Gorontalo Portal') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* ponytail: hide google translate banner/iframe */
        .goog-te-banner-frame{display:none!important}
        body{top:0!important}
        .goog-te-gadget{display:none!important}
        .skiptranslate{display:none!important}
        #google_translate_element{display:none!important}
        /* reset body top injected by google */
        body.translated-ltr, body.translated-rtl{margin-top:0!important}
    </style>
    <script>
        // restore lang from googtrans cookie before React hydrates
        try {
            var m=document.cookie.match(/(?:^|;)\s*googtrans=([^;]+)/);
            if(m){
                var code=decodeURIComponent(m[1]).split('/').pop();
                if(code && code!=='id') document.documentElement.lang=code;
            } else {
                var ls=localStorage.getItem('locale');
                if(ls && ls!=='id') document.documentElement.lang=ls;
            }
        } catch(e){}
        function googleTranslateElementInit(){
            new google.translate.TranslateElement({
                pageLanguage: 'id',
                includedLanguages: 'id,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
        }
    </script>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="antialiased">
    <div id="google_translate_element" aria-hidden="true"></div>
    @inertia
    <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
</body>
</html>
