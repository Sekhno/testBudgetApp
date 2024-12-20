import {ComponentFixture, TestBed} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {StorageService} from './storage/crud';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let mockStorageService: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    mockStorageService = jasmine.createSpyObj('StorageService', [
      'availableSignal',
      'retrieveCategories',
      'retrieveTransActions',
      'saveCategory',
      'saveTransAction'
    ]);

    mockStorageService.availableSignal.and.returnValue(true);
    mockStorageService.retrieveCategories.and.returnValue(
      Promise.resolve([{value: 'salary'}, {value: 'shop'}])
    );
    mockStorageService.retrieveTransActions.and.returnValue(
      Promise.resolve([
        { name: 'Levis', type: 'expenses', category: 'shop', date: new Date(), amount: 4800 },
        { name: 'Semantrum', type: 'incomes', category: 'salary', date: new Date(), amount: 21000 },
      ])
    );

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: StorageService, useValue: mockStorageService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize data on startup', async () => {
    fixture.detectChanges();
    await fixture.whenStable(); // Очікуємо виконання асинхронних методів
    expect(component.categories).toEqual(['salary', 'shop']);
    expect(component.dataSource.data).toEqual([
      { name: 'Levis', type: 'expenses', category: 'shop', date: jasmine.any(Date), amount: 4800 },
      { name: 'Semantrum', type: 'incomes', category: 'salary', date: jasmine.any(Date), amount: 21000 },
    ]);
    expect(component.total).toBe(16200); // 21000 - 4800
  });

  it('should add a new transaction', async () => {
    fixture.detectChanges();
    await fixture.whenStable(); // Очікуємо виконання асинхронних методів
    component.transGroup.setValue({
      name: 'Groceries',
      amount: 50,
      category: 'food',
      type: 'expenses',
      date: new Date('2024-01-01')
    });
    await component.addTransAction();

    expect(component.dataSource.data.length).toBe(3); // Додана нова транзакція
    expect(mockStorageService.saveTransAction).toHaveBeenCalledWith({
      name: 'Groceries',
      amount: 50,
      category: 'food',
      type: 'expenses',
      date: new Date('2024-01-01')
    });
  });

  it('should apply filters to transactions', async () => {
    fixture.detectChanges();
    await fixture.whenStable(); // Очікуємо виконання асинхронних методів
    component.filters.type = 'expenses';
    component.applyFilter();

    const filteredData = component.dataSource.filteredData;
    expect(filteredData.length).toBe(1); // Фільтрується тільки "expenses"
    expect(filteredData[0].name).toBe('Levis');
  });

  it('should add a new category', async () => {
    await component.addNewCategory('Health');
    expect(component.categories).toContain('Health');
    expect(mockStorageService.saveCategory).toHaveBeenCalledWith('Health');
  });

  it('should remove a category', async () => {
    fixture.detectChanges();
    await fixture.whenStable(); // Очікуємо виконання асинхронних методів
    component.categories = ['Food', 'Transport', 'Health'];
    component.removeCategory('Transport');
    expect(component.categories).toEqual(['Food', 'Health']);
  });

});
