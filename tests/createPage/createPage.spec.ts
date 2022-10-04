import { test, expect } from "@playwright/test";

const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

test.describe("новый пользователь открывает страницу create", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://4knort.github.io/colorizr");
  });

  test("видит color picker", async ({ page }) => {
    await expect(page.locator(".sketch-picker >> nth=0")).toBeVisible();
  });

  test("видит панель с выбором цветов", async ({ page }) => {
    await expect(page.locator(".panel >> nth=0")).toBeVisible();
  });

  test("видит 10 элементов выбора цвета", async ({ page }) => {
    const items = page.locator(".panel__color-item--choose");
    const items_count = await items.count();

    await expect(items_count).toEqual(10);
  });
  test("видит что у всех элементов выбора цвета фон rgba(245, 245, 245)", async ({
    page,
  }) => {
    const items = page.locator(".panel__color-item--choose");
    const items_count = await items.count();

    for (let i = 0; i < items_count; i++) {
      const loop_item = items.nth(i);

      await expect(loop_item).toHaveCSS(
        "background-color",
        "rgb(245, 245, 245)"
      );
    }
  });

  test("видит панель с 10 элементами готовых темных цветов", async ({
    page,
  }) => {
    const items = await page.locator(
      ".panel__colors >> nth=0 >> .panel__color-item"
    );

    const items_count = await items.count();
    await expect(items_count).toEqual(10);
  });

  test("видит кнопку select all в панеле с темными цветами", async ({
    page,
  }) => {
    const btn = await page.locator(".panel__btn >> nth=0");

    await expect(btn).toBeVisible();
  });

  test("видит панель с 10 готовыми смешанными цветами", async ({ page }) => {
    const items = await page.locator(
      ".panel__colors >> nth=1 >> .panel__color-item"
    );

    const items_count = await items.count();
    await expect(items_count).toEqual(10);
  });

  test("видит кнопку select all в панеле со смешанными цветами", async ({
    page,
  }) => {
    const btn = await page.locator(".panel__btn >> nth=1");

    await expect(btn).toBeVisible();
  });

  test("видит кнопку открытие колор пикера в панеле смешанных цветов", async ({
    page,
  }) => {
    const colorPickerBtn = await page.locator(".panel__color-block");

    await expect(colorPickerBtn).toBeVisible();
  });

  test("видит что в панеле смешанных цветов на элементах нет крестика", async ({
    page,
  }) => {
    const items = await page.locator(
      ".panel__colors >> nth=1 >> .panel__color-item >> .panel__color-icon"
    );
    const items_count = await items.count();

    for (let i = 0; i < items_count; i++) {
      const loop_item = items.nth(i);

      await expect(loop_item).toHaveCSS("display", "none");
    }
  });

  test("видит что в панеле темных цветов на элементах нет крестика", async ({
    page,
  }) => {
    const items = await page.locator(
      ".panel__colors >> nth=0 >> .panel__color-item >> .panel__color-icon"
    );

    const items_count = await items.count();
    for (let i = 0; i < items_count; i++) {
      const loop_item = items.nth(i);

      await expect(loop_item).toHaveCSS("display", "none");
    }
  });

  test.describe(`в панеле темных цветов нажимает на кнопку select all`, () => {
    test.beforeEach(async ({ page }) => {
      const btn = await page.locator(".panel__btn >> nth=0");

      await btn.click();
      await wait(1000); // color changes to slow, playwright is too fast
    });

    test(`в панеле выбора цветов все элементы окрасились соответствуя цветам в панеле темных цветов`, async ({
      page,
    }) => {
      const itemsChoose = await page.locator(".panel__color-item--choose");
      const itemsColor = await page.locator(
        ".panel__colors >> nth=0 >> .panel__color-item"
      );

      const items_count = await itemsChoose.count();

      for (let i = 0; i < items_count; i++) {
        const bgChooseItem = await itemsChoose.nth(i).evaluate((element) => {
          return window
            .getComputedStyle(element)
            .getPropertyValue("background-color");
        });

        const bgColorItem = await itemsColor.nth(i).evaluate((element) => {
          return window
            .getComputedStyle(element)
            .getPropertyValue("background-color");
        });

        await expect(bgChooseItem).toEqual(bgColorItem);
      }
    });

    test.describe("нажимает на первый элемент в панеле смешанных цветов", () => {
      test.beforeEach(async ({ page }) => {
        const itemColor = await page.locator(
          "div:nth-child(4) > .panel__colors > div:nth-child(2)"
        );
        await itemColor.click();
        await wait(1000); // color changes to slow, playwright is too fast
      });
      test(" видит что последний элемент в панеле выбора цвета окрасился в тот же цвет", async ({
        page,
      }) => {
        const itemChoose = await page.locator(
          ".panel__color-item--choose >> nth=9"
        );
        const itemColor = await page.locator(
          "div:nth-child(4) > .panel__colors > div:nth-child(2)"
        );

        const bgChooseItem = await itemColor.evaluate((element) => {
          return window
            .getComputedStyle(element)
            .getPropertyValue("background-color");
        });

        const bgColorItem = await itemChoose.evaluate((element) => {
          return window
            .getComputedStyle(element)
            .getPropertyValue("background-color");
        });

        expect(bgChooseItem).toEqual(bgColorItem);
      });
    });
  });

  test.describe(`в панеле смешанных цветов нажимает на кнопку select all`, () => {
    test.beforeEach(async ({ page }) => {
      const btn = await page.locator(".panel__btn >> nth=1");

      await btn.click();
      await wait(1000); // color changes to slow, playwright is too fast
    });
    test(`в панеле выбора цветов все элементы окрасились соответствуя цветам в панеле смешанных цветов`, async ({
      page,
    }) => {
      const itemsChoose = await page.locator(".panel__color-item--choose");
      const itemsColor = await page.locator(
        ".panel__colors >> nth=0 >> .panel__color-item"
      );

      const items_count = await itemsChoose.count();

      for (let i = 0; i < items_count; i++) {
        const bgChooseItem = await itemsChoose.nth(i).evaluate((element) => {
          return window
            .getComputedStyle(element)
            .getPropertyValue("background-color");
        });

        const bgColorItem = await itemsColor.nth(i).evaluate((element) => {
          return window
            .getComputedStyle(element)
            .getPropertyValue("background-color");
        });

        await expect(bgChooseItem).toEqual(bgColorItem);
      }
    });
  });

  test.describe(`наводит на элемент в панеле темных цветов`, () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("div:nth-child(3) > .panel__colors > div")
        .first()
        .hover();
    });

    test(`видит что появился крестик`, async ({ page }) => {
      const span = await page.locator(
        "div:nth-child(3) > .panel__colors > div > .panel__color-icon >> nth=0"
      );
      await expect(span).toHaveCSS("display", "block");
    });

    test.describe("убирает курсор с элемента", () => {
      test.beforeEach(async ({ page }) => {
        await page
          .locator("div:nth-child(3) > .panel__colors > div")
          .last()
          .hover();
      });
      test("видит что крестика нет", async ({ page }) => {
        const span = await page.locator(
          "div:nth-child(3) > .panel__colors > div > .panel__color-icon >> nth=0"
        );
        await expect(span).toHaveCSS("display", "none");
      });
    });
  });

  test.describe(`наводит на элемент в панеле смешанных цветов`, () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("div:nth-child(4) > .panel__colors > div:nth-child(2)")
        .hover();
    });
    test(`видит что появился крестик`, async ({ page }) => {
      const span = await page.locator(
        "div:nth-child(4) > .panel__colors > div:nth-child(2) > .panel__color-icon >> nth=0"
      );
      await expect(span).toHaveCSS("display", "block");
    });

    test.describe("убирает курсор с элемента", () => {
      test.beforeEach(async ({ page }) => {
        await page
          .locator("div:nth-child(3) > .panel__colors > div")
          .last()
          .hover();
      });
      test("видит что крестика нет", async ({ page }) => {
        const span = await page.locator(
          "div:nth-child(4) > .panel__colors > div:nth-child(2) > .panel__color-icon >> nth=0"
        );
        await expect(span).toHaveCSS("display", "none");
      });
    });
  });

  test.describe(`нажимает на первый элемент в панеле темных цветов`, () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("div:nth-child(3) > .panel__colors > div")
        .first()
        .click();
      await wait(1000); // color changes to slow, playwright is too fast
    });

    test(`видит что первый элемент в панеле выбора цветов окрасился в тот же цвет`, async ({
      page,
    }) => {
      const itemChoose = await page.locator(
        ".panel__color-item--choose >> nth=0"
      );
      const itemColor = await page.locator(
        "div:nth-child(3) > .panel__colors > div >> nth=0"
      );

      const bgChooseItem = await itemChoose.evaluate((element) => {
        return window
          .getComputedStyle(element)
          .getPropertyValue("background-color");
      });

      const bgColorItem = await itemColor.evaluate((element) => {
        return window
          .getComputedStyle(element)
          .getPropertyValue("background-color");
      });

      await expect(bgChooseItem).toEqual(bgColorItem);
    });

    test(`видит что на элементе появился крестик`, async ({ page }) => {
      const span = await page.locator(
        "div:nth-child(3) > .panel__colors > div > .panel__color-icon >> nth=0"
      );
      await expect(span).toHaveCSS("display", "block");
    });

    test.describe("наводит на покрашенный элемент в выборе цветов", () => {
      test.beforeEach(async ({ page }) => {
        await page.locator(".panel__color-item--choose >> nth=0").hover();
      });

      test("видит что на нем появился крестик", async ({ page }) => {
        const span = await page.locator(
          "text=Select up to 10 colors Select Colors by clicking on them+ >> span"
        );

        await expect(span).toHaveCSS("display", "block");
      });
      test.describe("уводит курсор на другой элемент", () => {
        test.beforeEach(async ({ page }) => {
          await page.locator(".panel__color-item--choose").last().hover();
        });
        test("видит что крестика нет", async ({ page }) => {
          const span = await page.locator(
            "text=Select up to 10 colors Select Colors by clicking on them+ >> span"
          );

          await expect(span).toHaveCSS("display", "none");
        });
      });
    });

    test.describe("нажимает на покрашенный элемент в выборе цветов", () => {
      test.beforeEach(async ({ page }) => {
        await page.locator(".panel__color-item--choose >> nth=0").click();
      });
      test("видит что он стал фон элемента стал прозрачным rgb(245. 245. 245)", async ({
        page,
      }) => {
        const colorItem = await page.locator(
          ".panel__color-item--choose >> nth=0"
        );
        await expect(colorItem).toHaveCSS(
          "background-color",
          "rgb(245, 245, 245)"
        );
      });
    });
  });

  test.describe("в панеле смешанных цветов", () => {
    test("видит кнопку для колор пикера", async ({ page }) => {
      const colorPickerBtn = await page.locator("text=Mixed with >> span");
      await expect(colorPickerBtn).toBeVisible();
    });
  });
});
