export type StoreViewName = 'home' | 'accounts' | 'topup' | 'orders' | 'auth' | 'simulator';

export type AuthMode = 'login' | 'register';

export type TopupGameKey = 'rov' | 'freefire' | 'roblox';

export type ModalStateName = 'waiting' | 'success' | 'fulfillment';

export interface BannerItem {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface AccountProduct {
  id: string;
  dbId?: number;
  game: 'Roblox' | 'RoV';
  title: string;
  description?: string;
  levelOrRank?: string;
  serverRegion?: string;
  emailStatus?: string;
  heroesOrFruitsCount?: string;
  skinsOrWeaponsCount?: string;
  price: number;
  tags: string[];
  stock: 'in_stock' | 'sold_out';
  image: string;
  revealedUser: string;
  revealedPass: string;
}

export interface TopupPackage {
  id: string;
  dbId?: number;
  label: string;
  bonus: string;
  price: number;
  hot: boolean;
}

export type PackagesByGame = Record<TopupGameKey, TopupPackage[]>;

export interface CustomerOrder {
  id: string;
  dbId?: number;
  ref: string;
  title: string;
  type: string;
  date: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
  fulfillmentStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  revealedUser: string;
  revealedPass: string;
}

export interface ActiveOrder {
  id: string;
  dbId?: number;
  txRef: string;
  title: string;
  type: 'account' | 'topup';
  price: number;
  username: string;
  password?: string;
  date: string;
  qrPayload?: string;
}

export interface UserProfile {
  id?: number;
  username: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface StoreContextValue {
  currentView: StoreViewName;
  switchView: (view: StoreViewName, modeOverride?: AuthMode) => void;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  user: UserProfile | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  banners: BannerItem[];
  accountProducts: AccountProduct[];
  packagesData: PackagesByGame;
  activeTopupGame: TopupGameKey;
  selectedPackage: TopupPackage;
  uidInput: string;
  setUidInput: (val: string) => void;
  robloxUser: string;
  setRobloxUser: (val: string) => void;
  robloxPass: string;
  setRobloxPass: (val: string) => void;
  selectTopupGame: (game: TopupGameKey) => void;
  selectPackage: (pkgId: string) => void;
  handleTopupCheckout: () => Promise<void>;
  buyAccount: (accId: string) => Promise<void>;
  customerOrders: CustomerOrder[];
  seedNewDemoOrder: () => void;
  revealOrderCredentials: (u: string, p: string, title?: string) => void;
  isModalOpen: boolean;
  modalState: ModalStateName;
  activeOrder: ActiveOrder;
  openModal: (state?: ModalStateName) => void;
  closeModal: () => void;
  setModalState: (state: ModalStateName) => void;
  openSimulatorDirectly: () => void;
  simLogs: string[];
  simulateQRUpload: () => void;
  triggerWebhookSuccess: () => Promise<void>;
  triggerWebhookFailed: () => Promise<void>;
  selectedAccountForDetail: AccountProduct | null;
  openAccountDetail: (acc: AccountProduct) => void;
  closeAccountDetail: () => void;
  isAuthPromptOpen: boolean;
  closeAuthPrompt: () => void;
}
