import { translate } from "@/shared/i18n/resources";
import { Status } from "@/shared/types/status.types";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GetPrimaryFinanceAccountUseCase } from "@/features/finance/account/useCase/getPrimaryFinanceAccount.useCase";
import type { EnsureDefaultFinanceAccountsUseCase } from "@/features/finance/account/useCase/ensureDefaultFinanceAccounts.useCase";
import type { GetRecentFinanceTransactionsUseCase } from "@/features/finance/transaction/useCase/getRecentFinanceTransactions.useCase";
import type { GetFinanceSummaryUseCase } from "@/features/finance/transaction/useCase/getFinanceSummary.useCase";
import type { HomeShortcutKey } from "@/features/home/shortcut/data/dataSource/homeShortcut.model";
import type { EnsureDefaultHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/ensureDefaultHomeShortcuts.useCase";
import type { GetHomeShortcutsUseCase } from "@/features/home/shortcut/useCase/getHomeShortcuts.useCase";
import type { GetActiveProfileUseCase } from "@/features/workspace/activeProfile/useCase/getActiveProfile.useCase";
import type {
  HomeDashboardShortcutItem,
  HomeDashboardState,
  HomeDashboardTransactionItem,
  HomeDashboardViewModel,
} from "./homeDashboard.viewModel";

const DEFAULT_SHORTCUT_ICON_MAP: Record<HomeShortcutKey, string> = {
  my_profile: "person-outline",
  my_accounts: "wallet-outline",
  statement: "receipt-outline",
  esewa: "cash-outline",
  quick_pos: "grid-outline",
  send_money: "paper-plane-outline",
};

const DEFAULT_SHORTCUT_LABEL_MAP: Record<HomeShortcutKey, string> = {
  my_profile: "home.shortcuts.myProfile",
  my_accounts: "home.shortcuts.myAccounts",
  statement: "home.shortcuts.statement",
  esewa: "home.shortcuts.esewa",
  quick_pos: "home.shortcuts.quickPos",
  send_money: "home.shortcuts.sendMoney",
};

const getGreetingMessage = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return translate("home.greeting.morning");
  }

  if (hour < 17) {
    return translate("home.greeting.afternoon");
  }

  return translate("home.greeting.evening");
};

const mapShortcut = (shortcutKey: HomeShortcutKey): HomeDashboardShortcutItem => {
  return {
    key: shortcutKey,
    iconName: DEFAULT_SHORTCUT_ICON_MAP[shortcutKey],
    label: translate(DEFAULT_SHORTCUT_LABEL_MAP[shortcutKey]),
  };
};

const mapTransaction = (
  transaction: {
    id: string;
    categoryName: string | null;
    counterpartyName: string | null;
    note: string | null;
    occurredAt: number;
    amount: number;
    entryType:
      | "income"
      | "expense"
      | "payment_in"
      | "payment_out"
      | "transfer_out"
      | "transfer_in"
      | "pos_sale";
    status: "success" | "pending" | "failed";
  },
): HomeDashboardTransactionItem => {
  const title =
    transaction.counterpartyName ||
    transaction.categoryName ||
    transaction.note ||
    translate("home.transactions.defaultTitle");

  return {
    id: transaction.id,
    title,
    subtitle: new Date(transaction.occurredAt).toLocaleString(),
    occurredAt: transaction.occurredAt,
    amount: transaction.amount,
    entryType: transaction.entryType,
    statusLabel: transaction.status.toUpperCase(),
  };
};

type Params = {
  getActiveProfileUseCase: GetActiveProfileUseCase;
  ensureDefaultFinanceAccountsUseCase: EnsureDefaultFinanceAccountsUseCase;
  getPrimaryFinanceAccountUseCase: GetPrimaryFinanceAccountUseCase;
  ensureDefaultHomeShortcutsUseCase: EnsureDefaultHomeShortcutsUseCase;
  getHomeShortcutsUseCase: GetHomeShortcutsUseCase;
  getRecentFinanceTransactionsUseCase: GetRecentFinanceTransactionsUseCase;
  getFinanceSummaryUseCase: GetFinanceSummaryUseCase;
  onMyProfilePress: () => void;
  onMyAccountsPress: () => void;
  onStatementPress: () => void;
  onEsewaPress: () => void;
  onQuickPosPress: () => void;
  onSendMoneyPress: () => void;
  onViewAllTransactionsPress: () => void;
  onNotificationsPress: () => void;
};

export const useHomeDashboardViewModel = (
  params: Params,
): HomeDashboardViewModel => {
  const {
    getActiveProfileUseCase,
    ensureDefaultFinanceAccountsUseCase,
    getPrimaryFinanceAccountUseCase,
    ensureDefaultHomeShortcutsUseCase,
    getHomeShortcutsUseCase,
    getRecentFinanceTransactionsUseCase,
    getFinanceSummaryUseCase,
    onMyProfilePress,
    onMyAccountsPress,
    onStatementPress,
    onEsewaPress,
    onQuickPosPress,
    onSendMoneyPress,
    onViewAllTransactionsPress,
    onNotificationsPress,
  } = params;

  const isLoadingRef = useRef(false);
  const [state, setState] = useState<HomeDashboardState>({
    status: Status.Idle,
    greeting: getGreetingMessage(),
    profileName: "",
    accountName: "",
    accountNumber: "",
    currencyCode: "NPR",
    balance: 0,
    totalInflow: 0,
    totalOutflow: 0,
    todayInflow: 0,
    todayOutflow: 0,
    shortcuts: [],
    recentTransactions: [],
    errorMessage: "",
  });

  const loadDashboard = useCallback(async (): Promise<void> => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;

    setState((currentState) => ({
      ...currentState,
      status: Status.Loading,
      greeting: getGreetingMessage(),
      errorMessage: "",
    }));

    try {
      const activeProfileResult = await getActiveProfileUseCase.execute();

      if (!activeProfileResult.success || !activeProfileResult.value) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("home.errors.noActiveProfile"),
        }));
        return;
      }

      const activeProfile = activeProfileResult.value;

      const ensureAccountsResult = await ensureDefaultFinanceAccountsUseCase.execute(
        activeProfile.profileId,
      );

      if (!ensureAccountsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("home.errors.accountsLoadFailed"),
        }));
        return;
      }

      const ensureShortcutsResult = await ensureDefaultHomeShortcutsUseCase.execute(
        activeProfile.profileId,
      );

      if (!ensureShortcutsResult.success) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("home.errors.shortcutsLoadFailed"),
        }));
        return;
      }

      const [primaryAccountResult, shortcutsResult, transactionsResult, summaryResult] =
        await Promise.all([
          getPrimaryFinanceAccountUseCase.execute(activeProfile.profileId),
          getHomeShortcutsUseCase.execute(activeProfile.profileId),
          getRecentFinanceTransactionsUseCase.execute(activeProfile.profileId, 8),
          getFinanceSummaryUseCase.execute(activeProfile.profileId),
        ]);

      if (
        !primaryAccountResult.success ||
        !shortcutsResult.success ||
        !transactionsResult.success ||
        !summaryResult.success
      ) {
        setState((currentState) => ({
          ...currentState,
          status: Status.Failure,
          errorMessage: translate("home.errors.dashboardLoadFailed"),
        }));
        return;
      }

      const shortcuts = shortcutsResult.value
        .sort((leftItem, rightItem) => leftItem.sortOrder - rightItem.sortOrder)
        .map((shortcut) => mapShortcut(shortcut.shortcutKey));

      const recentTransactions = transactionsResult.value.map((transaction) => {
        return mapTransaction(transaction);
      });

      setState((currentState) => ({
        ...currentState,
        status: Status.Success,
        profileName: activeProfile.profileName,
        accountName:
          primaryAccountResult.value?.accountName ?? translate("home.account.default"),
        accountNumber: primaryAccountResult.value?.accountNumber ?? "",
        currencyCode: primaryAccountResult.value?.currencyCode ?? "NPR",
        balance: primaryAccountResult.value?.currentBalance ?? 0,
        totalInflow: summaryResult.value.totalInflow,
        totalOutflow: summaryResult.value.totalOutflow,
        todayInflow: summaryResult.value.todayInflow,
        todayOutflow: summaryResult.value.todayOutflow,
        shortcuts,
        recentTransactions,
        errorMessage: "",
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    ensureDefaultFinanceAccountsUseCase,
    ensureDefaultHomeShortcutsUseCase,
    getActiveProfileUseCase,
    getFinanceSummaryUseCase,
    getHomeShortcutsUseCase,
    getPrimaryFinanceAccountUseCase,
    getRecentFinanceTransactionsUseCase,
  ]);

  const onShortcutPress = useCallback(
    (shortcutKey: HomeShortcutKey): void => {
      switch (shortcutKey) {
        case "my_profile":
          onMyProfilePress();
          return;
        case "my_accounts":
          onMyAccountsPress();
          return;
        case "statement":
          onStatementPress();
          return;
        case "esewa":
          onEsewaPress();
          return;
        case "quick_pos":
          onQuickPosPress();
          return;
        case "send_money":
          onSendMoneyPress();
          return;
        default:
          return;
      }
    },
    [
      onEsewaPress,
      onMyAccountsPress,
      onMyProfilePress,
      onQuickPosPress,
      onSendMoneyPress,
      onStatementPress,
    ],
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    state,
    onRefreshPress: loadDashboard,
    onShortcutPress,
    onViewAllTransactionsPress,
    onNotificationsPress,
    onProfilePress: onMyProfilePress,
  };
};
