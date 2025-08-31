#!/bin/bash
echo "=== DIAGNÓSTICO DO PROJETO HRFlow ==="
echo "Data: $(date)"
echo ""

echo "📁 ESTRUTURA DE PASTAS:"
echo "----------------------"
find . -type d -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/\.*" | sort
echo ""

echo "📄 ARQUIVOS PRINCIPAIS:"
echo "----------------------"
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | head -20
echo ""

echo "⚙️  DEPENDÊNCIAS BACKEND:"
echo "------------------------"
cd backend && npm list --depth=0 2>/dev/null
echo ""

echo "⚙️  DEPENDÊNCIAS FRONTEND:"
echo "-------------------------"
cd ../frontend && npm list --depth=0 2>/dev/null
echo ""

echo "🚀 SCRIPTS DISPONÍVEIS:"
echo "----------------------"
echo "Backend:"
cd ../backend && npm run 2>/dev/null | grep -E "^[a-zA-Z]" | sed 's/^/  /'
echo "Frontend:"
cd ../frontend && npm run 2>/dev/null | grep -E "^[a-zA-Z]" | sed 's/^/  /'
echo ""

echo "📊 GIT INFO:"
echo "-----------"
cd .. && git branch 2>/dev/null
cd .. && git log --oneline -5 2>/dev/null