import { test, expect, Page } from '@playwright/test';

test.describe('Tetris ゲーム - 基本機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // ページが完全に読み込まれるまで待機
    await page.waitForSelector('.game-board');
  });

  test('ページが正しく読み込まれる', async ({ page }) => {
    // ページタイトルをチェック
    await expect(page).toHaveTitle(/Tetris Game/);
    
    // 主要なゲーム要素が表示されているかチェック
    await expect(page.locator('.game-board')).toBeVisible();
    await expect(page.locator('.game-info')).toBeVisible();
    await expect(page.locator('h2')).toContainText('テトリス');
  });

  test('ゲームボードが正しくレンダリングされる', async ({ page }) => {
    // ゲームボードのサイズをチェック（20行 × 10列）
    const boardRows = page.locator('.board-row');
    await expect(boardRows).toHaveCount(20);
    
    // 最初の行のセル数をチェック
    const firstRowCells = boardRows.first().locator('.board-cell');
    await expect(firstRowCells).toHaveCount(10);
  });

  test('スコア、レベル、ライン情報が表示される', async ({ page }) => {
    // ゲーム情報が表示されているかチェック
    await expect(page.locator('.game-info')).toBeVisible();
    
    // 初期値のチェック
    await expect(page.locator('.game-info')).toContainText('スコア: 0');
    await expect(page.locator('.game-info')).toContainText('レベル: 1');
    await expect(page.locator('.game-info')).toContainText('ライン: 0');
  });

  test('操作説明が表示される', async ({ page }) => {
    // 操作説明が表示されているかチェック
    await expect(page.locator('.instructions')).toBeVisible();
    await expect(page.locator('.instructions')).toContainText('操作方法:');
    await expect(page.locator('.instructions')).toContainText('←→: 左右移動');
    await expect(page.locator('.instructions')).toContainText('↓: 下移動');
    await expect(page.locator('.instructions')).toContainText('↑: 回転');
    await expect(page.locator('.instructions')).toContainText('スペース: ハードドロップ');
    await expect(page.locator('.instructions')).toContainText('P: 一時停止');
    await expect(page.locator('.instructions')).toContainText('R: リセット');
  });

  test('次のピースプレビューが表示される', async ({ page }) => {
    // 次のピースプレビューが表示されているかチェック
    await expect(page.locator('.next-piece')).toBeVisible();
    await expect(page.locator('.next-piece')).toContainText('次のピース');
  });

  test('現在のピースが表示される', async ({ page }) => {
    // ゲームが開始されて現在のピースが存在することを確認
    // ボード上に色のついたセルがあることをチェック
    await page.waitForTimeout(1000); // ピースが生成されるまで少し待機
    
    const coloredCells = page.locator('.board-cell').filter({
      has: page.locator('[style*="background-color"][style*="rgb"]')
    });
    
    await expect(coloredCells.first()).toBeVisible();
  });
});