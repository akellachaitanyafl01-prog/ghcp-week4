#!/bin/bash
cd /workspaces/ghcp-week4/src/accounting
echo "Running Journal Test Suite..."
echo "=============================="
npx jest --silent 2>/dev/null
RESULT=$?
echo ""
if [ $RESULT -eq 0 ]; then
  echo "✓ ALL TESTS PASSED"
else
  echo "✗ SOME TESTS FAILED"
fi
exit $RESULT
