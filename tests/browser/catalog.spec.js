import {test,expect} from '@playwright/test';

for(const width of [320,390,430,768,1280])test(`catalog fits ${width}px and turns pages`,async({page})=>{
 await page.setViewportSize({width,height:844});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.locator('h1')).toContainText('Move Naturally.');
 if(width===390)await page.screenshot({path:'.cache/mobile-cover.png',fullPage:true});
 const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 expect(await overflow()).toBe(false);
 await page.getByRole('button',{name:'Open the collection'}).click();
 await expect(page.locator('#book .turn-leaf')).toHaveCount(1);
 await expect(page.locator('#book .turn-leaf')).toHaveCount(0);
 const expectedSheets=width<=760?1:2;
 await expect(page.locator('#book > .sheet')).toHaveCount(expectedSheets);
 await expect(page.locator('#book > .sheet').first().locator('h2')).toHaveText('A little closer to nature.');
 if(width===390)await page.screenshot({path:'.cache/mobile-reader.png',fullPage:true});
 expect(await overflow()).toBe(false);
 await page.getByRole('button',{name:'Next page',exact:true}).click();
 await expect(page.locator('#book .turn-leaf')).toHaveCount(0);
 await page.getByRole('button',{name:'Previous page',exact:true}).click();
 await expect(page.locator('#book .turn-leaf')).toHaveCount(0);
 await expect(page.locator('#book > .sheet').first().locator('h2')).toHaveText('A little closer to nature.');
 await page.getByRole('button',{name:'Contents',exact:true}).click();
 await page.locator('dialog [data-index="4"]').click();
 await expect(page.locator('#book .turn-leaf')).toHaveCount(0);
 await page.locator('#book [data-product="p0"]').click();
 await expect(page.locator('dialog')).toBeVisible();
 expect(await page.locator('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 await page.getByRole('button',{name:'Inquire now'}).click();
 await page.locator('input[name="name"]').fill('Mobile Buyer');
 await page.locator('input[name="email"]').fill('buyer@example.com');
 await page.locator('input[name="consent"]').check();
 await page.getByRole('button',{name:'Send inquiry'}).click();
 await expect(page.locator('dialog h2')).toHaveText('Your inquiry is with us.');
 expect(errors).toEqual([]);
});

test('mobile touch swipe flips while vertical scrolling does not',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const page=await context.newPage();await page.goto('/');
 await expect(page.locator('h1')).toContainText('Move Naturally.');
 const client=await context.newCDPSession(page);
 const swipe=async(x1,y1,x2,y2)=>{
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x1,y:y1}]});
  for(let i=1;i<=6;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x1+(x2-x1)*i/6,y:y1+(y2-y1)*i/6}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 };
 await swipe(300,350,65,355);
 await expect(page.locator('#book > .sheet').first().locator('h2')).toHaveText('A little closer to nature.');
 await expect(page.locator('.turn-leaf')).toHaveCount(0);
 await swipe(200,500,202,250);
 await expect(page.locator('#book > .sheet').first().locator('h2')).toHaveText('A little closer to nature.');
 await context.close();
});

test('reduced motion skips turn layer and orientation change keeps the page',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.getByRole('button',{name:'Open the collection'}).click();
 await expect(page.locator('.turn-leaf')).toHaveCount(0);
 await page.getByRole('button',{name:'Next page',exact:true}).click();
 await page.setViewportSize({width:844,height:390});
 await expect(page.locator('#book > .sheet')).toHaveCount(2);
 await expect(page.locator('#book > .sheet').first().locator('h2')).toHaveText('A little closer to nature.');
});

test('rapid turns cancel stale layers and animation can be disabled',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await page.getByRole('button',{name:'Open the collection'}).click();
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'Next page',exact:true}).click();
 await expect(page.locator('#book > .sheet > h2')).toHaveText('Yoga Collection');
 await expect(page.locator('.turn-leaf')).toHaveCount(0);
 await page.getByRole('button',{name:'Toggle page animation'}).click();
 await page.getByRole('button',{name:'Previous page',exact:true}).click();
 await expect(page.locator('#book > .sheet > h2')).toHaveText('Find your movement.');
 await expect(page.locator('.turn-leaf')).toHaveCount(0);
});
