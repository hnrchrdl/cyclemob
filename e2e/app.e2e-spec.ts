import { CyclemobPage } from './app.po';

describe('cyclemob App', () => {
  let page: CyclemobPage;

  beforeEach(() => {
    page = new CyclemobPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
