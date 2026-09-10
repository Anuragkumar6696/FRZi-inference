import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './firebaseConfig.js';

export function initAuthFlow() {
  const authScreen = document.getElementById('auth-screen');
  const dashboardScreen = document.getElementById('dashboard-screen');
  
  const emailInput = document.getElementById('auth-email');
  const passwordInput = document.getElementById('auth-password');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const authError = document.getElementById('auth-error');

  if (!authScreen || !dashboardScreen) return;

  // Handle Sign-Up
  signupBtn?.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        transitionToDashboard(authScreen, dashboardScreen);
      })
      .catch((error) => {
        authError.textContent = error.message;
      });
  });

  // Handle Login
  loginBtn?.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        transitionToDashboard(authScreen, dashboardScreen);
      })
      .catch((error) => {
        authError.textContent = error.message;
      });
  });
}

// Screen Transition with Animation (Task 2.6)
function transitionToDashboard(fromScreen, toScreen) {
  fromScreen.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  fromScreen.style.opacity = '0';
  fromScreen.style.transform = 'translateY(-20px)';

  setTimeout(() => {
    fromScreen.style.display = 'none';
    toScreen.style.display = 'block';
    toScreen.style.opacity = '0';
    toScreen.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      toScreen.style.opacity = '1';
    }, 50);
  }, 500);
}