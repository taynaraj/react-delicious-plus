# Favicon - Delicious+

Esta pasta contém os arquivos de favicon do projeto.

## Arquivos necessários

Coloque os seguintes arquivos nesta pasta:

- `favicon.png` (512x512px) - Favicon para navegadores modernos
- `favicon.ico` (64x64px) - Favicon para compatibilidade com navegadores antigos

## Como gerar os arquivos

1. Use a logo existente: `src/assets/logo/dplus-logo.png`

2. Converta para PNG 512x512:
   - Use uma ferramenta online (ex: https://convertio.co/pt/png-ico/)
   - Ou use ImageMagick: `convert dplus-logo.png -resize 512x512 favicon.png`

3. Converta para ICO 64x64:
   - Use uma ferramenta online (ex: https://favicon.io/favicon-converter/)
   - Ou use ImageMagick: `convert dplus-logo.png -resize 64x64 favicon.ico`

4. Certifique-se de que os arquivos têm fundo transparente (PNG com alpha channel)

## Arquivos necessários

- `favicon.png` - 512x512px (PNG com transparência)
- `favicon.ico` - 64x64px (ICO)

Após adicionar os arquivos, o favicon será carregado automaticamente.

