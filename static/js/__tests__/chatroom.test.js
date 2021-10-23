const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    Key = webdriver.Key,
    until = webdriver.until;

const driver_ch = new webdriver.Builder().forBrowser('CHROME').build();
const driver_sf = new webdriver.Builder().forBrowser('SAFARI').build();
//const driver_ff = new webdriver.Builder().forBrowser('FIREFOX').build();
//const driver_eg = new webdriver.Builder().forBrowser('EDGE').build();

function ld(str){
    return driver_ch.executeScript('return localData.'+str)
}
function ls(str){
    return driver_ch.executeScript('return localDStorage.'+str)
}
function el(str){
    return driver_ch.findElement(By.css(str))
}

afterAll(()=>{
    driver_ch.quit(), driver_sf.quit();
})

describe('Test: user at first time', () => {
    beforeAll(()=>{
        driver_ch.executeScript(
            "localStorage.clear();"/
            "location.reload();"
        )
    });
    
    beforeEach(()=>{

    });
    AfterEach(()=>{

    });

    test('check status',()=>{
        var ld_st = driver_ch.executeScript('return localData.status'),
            ls_st = driver_ch.executeScript('return localStorage.status')
        expect(ld_st).toBe(0);
        expect(ls_st).toBe('0');
    })
    test('check GREET in 1s',()=>{
        await driver_ch.wait(until.elementTextIs(By.css('div.a-chat span'),'test:novice teaching'),1000)
        var elmt1 = driver_ch.findElement(By.css('#dialog>div.a-chat:eq(0) span')),
            elmt2 = driver_ch.findElement(By.css('#dialog>div.a-chat:eq(1) span')),
            elmt3 = driver_ch.findElement(By.css('#dialog>div.a-chat:eq(2) span'))
        expect(elmt1.getText).toBe('test:hello');
        expect(elmt2.getText).toBe('test:introduce a-card');
        expect(elmt3.getText).toBe('test:novice teaching');

    })
    test('check profile (anonName) in 1s',()=>{
        await driver_ch.wait(until.elementTextIs(By.css('nav.navbar span.a-matcher'),'測試人員(test)'),1000)
        var elmt = driver_ch.findElement(By.css('nav.navbar span.a-matcher')),
            ld_anonName = driver_ch.executeScript('return localData.anonName'),
            ls_anonName = driver_ch.executeScript('return localStorage.anonName')
        expect(elmt.getText).toBe('測試人員(test)');
        expect(ld_anonName).toBe('測試人員(test)');
        expect(ls_anonName).toBe('測試人員(test)');

        driver_ch.executeScript("location.reload();");  // after reload
        await driver_ch.sleep(1000);

        expect(elmt.getText).toBe('測試人員(test)');
        expect(ld_anonName).toBe('測試人員(test)');
        expect(ls_anonName).toBe('測試人員(test)');

    })
    test('check cmd:/profile (name, matchType) in 1s',()=>{
        await driver_ch.sleep(1000);  // 為使測試不被GREET干擾
        var elmt_input = driver_ch.findElement(By.css('#send-text'));
        elmt_input.sendKeys('/p jason mf',Key.ENTER);

        var elmt = driver_ch.findElement(By.css('nav.navbar span.a-self')),
            elmt_1 = driver_ch.findElement(By.css('nav.navbar span.a-type>i:eq(0)')),
            elmt_2 = driver_ch.findElement(By.css('nav.navbar span.a-type>i:eq(2)')),
            ld_name = driver_ch.executeScript('return localData.name'),
            ls_name = driver_ch.executeScript('return localStorage.name'),
            ld_matchType = driver_ch.executeScript('return localData.matchType'),
            ls_matchType = driver_ch.executeScript('return localStorage.matchType');
        
        expect(elmt.getText).toBe('jason');
        expect(ld_name).toBe('jason');
        expect(ls_name).toBe('jason');
        expect(elmt_1.getText).toBe('man');
        expect(elmt_2.getText).toBe('woman');
        expect(ld_matchType).toBe('mf');
        expect(ls_matchType).toBe('mf');

        driver_ch.executeScript("location.reload();");  // after reload
        await driver_ch.sleep(1000);

        expect(elmt.getText).toBe('jason');
        expect(ld_name).toBe('jason');
        expect(ls_name).toBe('jason');
        expect(elmt_1.getText).toBe('man');
        expect(elmt_2.getText).toBe('woman');
        expect(ld_matchType).toBe('mf');
        expect(ls_matchType).toBe('mf');
    })

    test('check cmd:/rename (name) in 1s',()=>{
        await driver_ch.sleep(1000);
        var elmt_input = el('#send-text');
        elmt_input.sendKeys('/n jason',Key.ENTER);

        var elmt = el('nav.navbar span.a-self'),
            ld_name = ld('return localData.name'),
            ls_name = ls('return localStorage.name');

        expect(elmt.getText).toBe('jason');
        expect(ld_name).toBe('jason');
        expect(ls_name).toBe('jason');

        driver_ch.executeScript("location.reload();");  // after reload
        await driver_ch.sleep(1000);

        expect(elmt.getText).toBe('jason');
        expect(ld_name).toBe('jason');
        expect(ls_name).toBe('jason');

    })
    test('check cmd:/leave in 1s',()=>{
        await driver_ch.sleep(1000);

    })
    test('check cmd:/change in 1s',()=>{
        await driver_ch.sleep(1000);

    })

    test('check cmd:/match (without profile) in 1s',()=>{
        await driver_ch.sleep(1000);

    })

    test('check cmd:/match (with profile and school) in 1s',()=>{
        await driver_ch.sleep(1000);

    })

    test('check cmd:/adult (with profile and school) in 1s',()=>{
        await driver_ch.sleep(1000);

    })

    test('check cmd:/retest in 1s',()=>{
        await driver_ch.sleep(1000);

    })
    
    
})

describe('Test: user in test', () => {
    beforeAll(()=>{
        driver_ch.executeScript(
            "localStorage.clear();"/
            "location.reload();"
        )
    });
})

describe('Test: user in room', () => {
    beforeAll(()=>{
        driver_ch.executeScript(
            "localStorage.clear();"/
            "location.reload();"
        )
    });
})

