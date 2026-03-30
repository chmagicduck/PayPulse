const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const baseDir = path.join(root, 'miniprogram');
const outFile = path.join(root, 'docs', 'cn-copy-inventory.md');

const includeExt = new Set(['.ts', '.wxml', '.json']);
const chineseRe = /\p{Script=Han}/u;
const excludedRelPaths = new Set(['sitemap.json']);

const sectionMeta = {
  __global__: {
    title: 'Global And Shared Copy',
    desc: 'Cross-page copy such as app navigation, tab labels, calendar status prompts, and shared domain-generated text.'
  },
  home: {
    title: 'Home',
    desc: 'Dashboard copy for income display, session toggle, task preview, recurring reminders, important dates, and life journey cards.'
  },
  report: {
    title: 'Report',
    desc: 'Analytics and report copy for trends, annual summaries, ratio labels, historical cards, and related descriptions.'
  },
  lab: {
    title: 'Lab',
    desc: 'Progression and task-system copy including level names, daily tasks, weekly achievements, and energy feedback.'
  },
  profile: {
    title: 'Profile',
    desc: 'Personal center copy including identity summary, menu entries, avatar actions, and related navigation.'
  },
  'profile-settings': {
    title: 'Profile Settings',
    desc: 'Form copy for personal profile and work parameters, including field labels, options, validation, and save feedback.'
  },
  'time-axis': {
    title: 'Time Axis',
    desc: 'Milestone and time-axis copy for event cards, editing flows, category names, and reminder labels.'
  },
  calendar: {
    title: 'Calendar',
    desc: 'Calendar and holiday-status copy covering workdays, payday, statutory holidays, weekends, and reminders.'
  },
  community: {
    title: 'Community',
    desc: 'Community-join page copy including brand messaging, benefit descriptions, join hints, errors, and fallback prompts.'
  },
  about: {
    title: 'About',
    desc: 'Brand and product-story copy including app name, slogan, changelog, design principles, and legal text.'
  },
  'data-center': {
    title: 'Data Center',
    desc: 'Data management copy for storage overview, export/reset actions, risk warnings, and confirmation dialogs.'
  }
};

const fileRoleRules = [
  [/app\.json$/, 'App-level page registration and tab bar labels.'],
  [/config[\\/]tabbar\.ts$/, 'Typed tab bar config copy, expected to stay aligned with app.json tab labels.'],
  [/\.wxml$/, 'Direct user-visible copy in page or component templates.'],
  [/community\.ts$/, 'Interaction feedback for join flow, fallback hints, and toast messages.'],
  [/profile-settings\.ts$/, 'Save-flow feedback such as review results and success prompts.'],
  [/profile\.ts$/, 'Avatar-related interaction feedback in the profile page.'],
  [/time-axis\.ts$/, 'Operational feedback for timeline actions such as system-card restrictions.'],
  [/data-center\.ts$/, 'Action feedback for export/reset operations in the data center page.'],
  [/helper[\\/]validate\.ts$/, 'Form validation error copy.'],
  [/model[\\/]options\.ts$/, 'Option labels used by form controls.'],
  [/model\.ts$/, 'Static page content, card titles, tags, or sample copy.'],
  [/model[\\/].*state\.ts$/, 'Runtime view-model text such as labels, summaries, and metrics.'],
  [/state\.ts$/, 'Runtime state-derived copy.'],
  [/helper\.ts$/, 'Display helper output such as labels, units, and assembled UI text.'],
  [/lib[\\/]domain[\\/]calendar-config\.ts$/, 'Holiday config copy including names, badges, and descriptions.'],
  [/lib[\\/]domain[\\/]calendar\.ts$/, 'Shared calendar status, reminders, and pacing-related copy.'],
  [/lib[\\/]domain[\\/]date\.ts$/, 'Chinese date-formatting output.'],
  [/lib[\\/]domain[\\/]daily-records\.ts$/, 'Income/work-time domain copy and report summaries.'],
  [/lib[\\/]/, 'Shared domain-layer or utility-layer copy output.'],
  [/\.ts$/, 'Copy emitted from page logic, helpers, or domain models.'],
  [/\.json$/, 'Static copy stored in configuration files.']
];

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
      continue;
    }
    if (!includeExt.has(path.extname(entry.name))) {
      continue;
    }
    results.push(full);
  }
  return results;
}

function getSectionKey(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  const match = normalized.match(/^features\/([^/]+)/);
  return match ? match[1] : '__global__';
}

function getFileRole(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  for (const [re, desc] of fileRoleRules) {
    if (re.test(normalized)) {
      return desc;
    }
  }
  return 'Source file that contains Chinese copy.';
}

function classifyLine(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  if (normalized.endsWith('.wxml')) {
    return 'UI Copy';
  }
  if (
    normalized.endsWith('community.ts') ||
    normalized.endsWith('profile-settings.ts') ||
    normalized.endsWith('profile.ts') ||
    normalized.endsWith('time-axis.ts') ||
    normalized.endsWith('data-center.ts')
  ) {
    return 'Interaction Feedback';
  }
  if (normalized.includes('/model') || normalized.endsWith('model.ts') || normalized.endsWith('options.ts')) {
    return 'Static Content';
  }
  if (normalized.includes('lib/domain') || normalized.endsWith('state.ts') || normalized.endsWith('helper.ts')) {
    return 'Domain And State Copy';
  }
  if (normalized.endsWith('.json')) {
    return 'Config Copy';
  }
  return 'Other Copy';
}

function isCommentLine(trimmed) {
  return trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('*/');
}

function cleanLine(line) {
  return line.replace(/\t/g, '  ').trim();
}

function shouldIncludeLine(line) {
  const trimmed = line.trim();
  if (!trimmed) {
    return false;
  }
  if (!chineseRe.test(trimmed)) {
    return false;
  }
  if (isCommentLine(trimmed)) {
    return false;
  }
  return true;
}

const groups = new Map();
let totalFiles = 0;
let totalEntries = 0;

for (const file of walk(baseDir)) {
  const relPath = path.relative(baseDir, file).replace(/\\/g, '/');
  if (excludedRelPaths.has(relPath)) {
    continue;
  }

  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const entries = [];

  lines.forEach((line, idx) => {
    if (!shouldIncludeLine(line)) {
      return;
    }
    entries.push({
      line: idx + 1,
      text: cleanLine(line),
      category: classifyLine(relPath)
    });
  });

  if (!entries.length) {
    continue;
  }

  totalFiles += 1;
  totalEntries += entries.length;

  const sectionKey = getSectionKey(relPath);
  if (!groups.has(sectionKey)) {
    groups.set(sectionKey, []);
  }
  groups.get(sectionKey).push({
    relPath,
    role: getFileRole(relPath),
    entries
  });
}

const sectionOrder = [
  '__global__',
  'home',
  'report',
  'lab',
  'profile',
  'profile-settings',
  'time-axis',
  'calendar',
  'community',
  'about',
  'data-center'
];

let out = '';
out += '# Chinese Copy Inventory\n\n';
out += '## Notes\n\n';
out += '- Scope: scans `*.ts`, `*.wxml`, and `*.json` files under `miniprogram/` for Chinese copy.\n';
out += '- Goal: provide a rewrite-ready inventory for another AI, while keeping enough product context to understand what each string does.\n';
out += '- Excluded: code comments, repository docs, style-only files, `sitemap.json`, and anything outside `miniprogram/`.\n';
out += '- Retention rule: the same phrase is kept multiple times when it appears in different pages or different semantic positions.\n';
out += `- Extraction stats: ${totalFiles} files, ${totalEntries} Chinese-copy records.\n\n`;
out += '## Module Index\n\n';

for (const key of sectionOrder) {
  if (!groups.has(key)) {
    continue;
  }
  out += `- ${sectionMeta[key].title}\n`;
}

out += '\n';

for (const key of sectionOrder) {
  if (!groups.has(key)) {
    continue;
  }

  const meta = sectionMeta[key];
  out += `## ${meta.title}\n\n`;
  out += `${meta.desc}\n\n`;

  const files = groups.get(key).sort((a, b) => a.relPath.localeCompare(b.relPath, 'zh-CN'));

  for (const file of files) {
    out += `### ${file.relPath}\n\n`;
    out += `- File role: ${file.role}\n`;
    out += `- Copy type: ${[...new Set(file.entries.map((item) => item.category))].join(', ')}\n`;
    out += `- Entry count: ${file.entries.length}\n\n`;

    for (const entry of file.entries) {
      out += `- L${entry.line} [${entry.category}] ${entry.text}\n`;
    }

    out += '\n';
  }
}

fs.writeFileSync(outFile, out, 'utf8');
console.log(`Wrote ${outFile} with ${totalFiles} files / ${totalEntries} entries`);
