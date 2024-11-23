// utils/telegram.js
export const getTelegramUser = () => {
    const tg = (window as any).Telegram.WebApp;
  
    // Ensure Telegram WebApp is initialized
    tg.ready();
  
    // Extract user info from Telegram WebApp
    const user = tg.initDataUnsafe?.user;
  
    if (!user) {
      throw new Error('Failed to fetch Telegram user data');
    }
  
    return {
      telegramId: user.id,
      firstName: user.first_name,
      lastName: user.last_name || '', // Last name may be optional
      username: user.username || '', // Optional username
    };
  };
  