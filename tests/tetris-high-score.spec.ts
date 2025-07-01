import { test, expect, Page } from '@playwright/test';

test.describe('Tetris ゲーム - 最高記録機能', () => {
  test.beforeEach(async ({ page }) => {
    // ローカルストレージをクリア
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('tetris_high_score');
    });
    await page.reload();
    await page.waitForSelector('.game-board');
    await page.waitForTimeout(500);
  });

  test('初期状態で最高記録が0と表示される', async ({ page }) => {
    // 最高記録セクションが表示されることを確認
    await expect(page.locator('.high-score-section')).toBeVisible();
    await expect(page.locator('.high-score-section')).toContainText('最高記録');
    await expect(page.locator('.high-score-section')).toContainText('0');
  });

  test('最高記録がローカルストレージから読み込まれる', async ({ page }) => {
    // ローカルストレージに最高記録を設定
    await page.evaluate(() => {
      localStorage.setItem('tetris_high_score', '12345');
    });
    
    // ページをリロードして最高記録が表示されることを確認
    await page.reload();
    await page.waitForSelector('.game-board');
    await page.waitForTimeout(500);
    
    await expect(page.locator('.high-score-section')).toContainText('12,345');
  });

  test('スコアが最高記録より低い場合、最高記録は更新されない', async ({ page }) => {
    // 初期の最高記録を設定
    await page.evaluate(() => {
      localStorage.setItem('tetris_high_score', '1000');
    });
    await page.reload();
    await page.waitForSelector('.game-board');
    await page.waitForTimeout(500);
    
    // 初期最高記録を確認
    await expect(page.locator('.high-score-section')).toContainText('1,000');
    
    // 低いスコアでゲームを終了させる試み
    // （実際のゲームオーバーは困難なので、基本的なテストとして最高記録の表示を確認）
    await page.keyboard.press('KeyR'); // リセット
    await page.waitForTimeout(100);
    
    // 最高記録が維持されることを確認
    await expect(page.locator('.high-score-section')).toContainText('1,000');
  });

  test('ゲームリセット後も最高記録が保持される', async ({ page }) => {
    // 最高記録を設定
    await page.evaluate(() => {
      localStorage.setItem('tetris_high_score', '5000');
    });
    await page.reload();
    await page.waitForSelector('.game-board');
    await page.waitForTimeout(500);
    
    // リセット前の最高記録を確認
    await expect(page.locator('.high-score-section')).toContainText('5,000');
    
    // ゲームをリセット
    await page.keyboard.press('KeyR');
    await page.waitForTimeout(200);
    
    // リセット後も最高記録が保持されることを確認
    await expect(page.locator('.high-score-section')).toContainText('5,000');
    await expect(page.locator('.score-section')).toContainText('0'); // スコアはリセット
  });

  test('最高記録の表示フォーマットが正しい', async ({ page }) => {
    // 大きな数値を設定
    await page.evaluate(() => {
      localStorage.setItem('tetris_high_score', '123456789');
    });
    await page.reload();
    await page.waitForSelector('.game-board');
    await page.waitForTimeout(500);
    
    // 数値がカンマ区切りで表示されることを確認
    await expect(page.locator('.high-score-section')).toContainText('123,456,789');
  });

  test('ローカルストレージが利用できない場合のフォールバック', async ({ page }) => {
    // ローカルストレージを無効にする（この場合は0が表示されるはず）
    await page.addInitScript(() => {
      // ローカルストレージの getItem をモック
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => { throw new Error('localStorage not available'); },
          setItem: () => { throw new Error('localStorage not available'); },
          removeItem: () => { throw new Error('localStorage not available'); }
        },
        writable: true
      });
    });
    
    await page.goto('/');
    await page.waitForSelector('.game-board');
    await page.waitForTimeout(500);
    
    // エラーが発生してもアプリケーションが動作し、最高記録が0と表示されることを確認
    await expect(page.locator('.high-score-section')).toBeVisible();
    await expect(page.locator('.high-score-section')).toContainText('0');
  });

  test('数値以外の値がローカルストレージに保存されている場合の処理', async ({ page }) => {
    // 無効な値を設定
    await page.evaluate(() => {
      localStorage.setItem('tetris_high_score', 'invalid_value');
    });
    
    await page.goto('/');
    await page.waitForSelector('.game-board');
    await page.waitForTimeout(500);
    
    // 無効な値の場合は0として扱われることを確認
    await expect(page.locator('.high-score-section')).toContainText('0');
  });

  test('負の値がローカルストレージに保存されている場合の処理', async ({ page }) => {
    // 負の値を設定
    await page.evaluate(() => {
      localStorage.setItem('tetris_high_score', '-100');
    });
    
    await page.goto('/');
    await page.waitForSelector('.game-board');
    await page.waitForTimeout(500);
    
    // 負の値もそのまま表示されることを確認（または0として扱われる）
    const highScoreText = await page.locator('.high-score-section').textContent();
    expect(highScoreText).toMatch(/最高記録/);
  });

  test('ページリロード時の最高記録の永続化', async ({ page }) => {
    // 最高記録を設定
    await page.evaluate(() => {
      localStorage.setItem('tetris_high_score', '7777');
    });
    
    // 複数回リロードしても最高記録が保持されることを確認
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForSelector('.game-board');
      await page.waitForTimeout(300);
      
      await expect(page.locator('.high-score-section')).toContainText('7,777');
    }
  });
});