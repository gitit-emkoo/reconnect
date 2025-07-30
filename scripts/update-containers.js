import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 페이지 파일들이 있는 디렉토리들
const pageDirs = [
  'src/pages',
  'src/components'
];

// 제외할 파일들 (이미 변경된 파일들)
const excludeFiles = [
  'MyPage.tsx',
  'Community.tsx',
  'Dashboard.tsx'
];

// Container 패턴들
const containerPatterns = [
  /const Container = styled\.div`[\s\S]*?`;/g,
  /const PageContainer = styled\.div`[\s\S]*?`;/g
];

// 파일 경로에 따른 import 문 계산
function getImportStatement(filePath) {
  const relativePath = path.relative(path.dirname(filePath), 'src/styles/CommonStyles');
  return `import { Container } from '${relativePath.replace(/\\/g, '/')}';`;
}

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Container 패턴 찾기 및 제거
    containerPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '');
        modified = true;
      }
    });

    // import 문 추가 (이미 있지 않은 경우)
    if (modified && !content.includes("import { Container } from")) {
      const importStatement = getImportStatement(filePath);
      
      // React import 다음에 추가
      const reactImportIndex = content.indexOf("import React");
      if (reactImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', reactImportIndex) + 1;
        content = content.slice(0, nextLineIndex) + importStatement + '\n' + content.slice(nextLineIndex);
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') && !excludeFiles.includes(file)) {
      updateFile(filePath);
    }
  });
}

// 실행
console.log('🔄 Updating Container components...');
pageDirs.forEach(dir => {
  processDirectory(dir);
});
console.log('✅ Container update completed!');