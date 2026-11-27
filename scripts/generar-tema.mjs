/* =========================================================
   Genera los TOKENS DE COLOR de Material Design 3
   a partir de los colores de marca de Yoshi Tech.
   Es lo mismo que hace la web "Material Theme Builder",
   pero con la librería oficial de Google:
   @material/material-color-utilities

   Uso:  npm run tema   →  crea public_html/scss/_tokens-color.scss
   ========================================================= */
import { writeFileSync } from 'node:fs';
import {
  argbFromHex, hexFromArgb, Hct, TonalPalette,
  DynamicScheme, MaterialDynamicColors, Variant,
} from '@material/material-color-utilities';

const MARCA = '#00ffff';      // cian de Yoshi Tech  → color "primary"
const ACENTO = '#8a2be2';     // morado de Yoshi Tech → color "tertiary"

const semilla = Hct.fromInt(argbFromHex(MARCA));
const paletas = {
  primaryPalette: TonalPalette.fromInt(argbFromHex(MARCA)),
  secondaryPalette: TonalPalette.fromHueAndChroma(semilla.hue, 16),
  tertiaryPalette: TonalPalette.fromInt(argbFromHex(ACENTO)),
  neutralPalette: TonalPalette.fromHueAndChroma(semilla.hue, 6),
  neutralVariantPalette: TonalPalette.fromHueAndChroma(semilla.hue, 10),
};

const ROLES = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer', 'inversePrimary',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'background', 'onBackground', 'surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant',
  'surfaceDim', 'surfaceBright', 'surfaceContainerLowest', 'surfaceContainerLow',
  'surfaceContainer', 'surfaceContainerHigh', 'surfaceContainerHighest',
  'inverseSurface', 'inverseOnSurface', 'outline', 'outlineVariant', 'shadow', 'scrim', 'surfaceTint',
];

const kebab = (s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

function esquema(isDark) {
  const s = new DynamicScheme({
    sourceColorHct: semilla, variant: Variant.TONAL_SPOT, contrastLevel: 0, isDark, ...paletas,
  });
  return ROLES.map((rol) => `  ${kebab(rol)}: ${hexFromArgb(MaterialDynamicColors[rol].getArgb(s))},`).join('\n');
}

const scss = `// ARCHIVO GENERADO por scripts/generar-tema.mjs — no editar a mano.
// Roles de color de Material Design 3 (semilla ${MARCA}, acento ${ACENTO}).

$tema-claro: (
${esquema(false)}
);

$tema-oscuro: (
${esquema(true)}
);
`;
writeFileSync('public_html/scss/_tokens-color.scss', scss);
console.log('✔ Tokens de color generados en public_html/scss/_tokens-color.scss');
