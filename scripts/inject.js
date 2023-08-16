const css = hexo.extend.helper.get('css').bind(hexo);
const js = hexo.extend.helper.get('js').bind(hexo);

// hexo.extend.injector.register('head_end', () => css('/css/user.css'));
hexo.extend.injector.register('body_end', () => {
  const { enable, models, styles } = hexo.config.spine;
  if (enable) {
    return `
    <div class="spine-widget"></div>
    <script src="https://jsd.onmicrosoft.cn/gh/EsotericSoftware/spine-runtimes@3.6.53/spine-ts/build/spine-widget.js"></script>
    <script>
      new SpineModel({
        models: ${JSON.stringify(models)},
        styles: ${JSON.stringify(styles)},
      });
    </script>
    `;
  } else {
    return null;
  }
});
