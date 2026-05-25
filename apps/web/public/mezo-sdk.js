class MezoOS {
  constructor(config) {
    if (!config || !config.apiKey) {
      throw new Error('MezoOS: apiKey is required in the configuration object.');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://mezoos.onrender.com';
    this._iframe = null;
    this._overlay = null;
    this._callbacks = {};

    this._setupMessageListener();
  }

  _setupMessageListener() {
    window.addEventListener('message', (event) => {
      // For local testing, allow any origin, or strict match in production
      if (!event.origin.includes('localhost') && !event.origin.includes('mezoos.onrender.com')) {
        return;
      }

      const data = event.data;
      if (data && data.type === 'MEZO_SUCCESS') {
        this.closeModal();
        if (this._callbacks.onSuccess) {
          this._callbacks.onSuccess(data.txHash);
        }
      }

      if (data && data.type === 'MEZO_CANCEL') {
        this.closeModal();
        if (this._callbacks.onCancel) {
          this._callbacks.onCancel();
        }
      }
    });
  }

  createSubscription(options) {
    if (!options.amount || !options.interval || !options.title) {
      throw new Error('MezoOS: amount, interval, and title are required for a subscription.');
    }

    this._callbacks.onSuccess = options.onSuccess;
    this._callbacks.onCancel = options.onCancel;

    this._openModal(options);
  }

  _openModal(options) {
    if (this._overlay) return;

    // Create background overlay
    this._overlay = document.createElement('div');
    this._overlay.style.position = 'fixed';
    this._overlay.style.top = '0';
    this._overlay.style.left = '0';
    this._overlay.style.width = '100vw';
    this._overlay.style.height = '100vh';
    this._overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    this._overlay.style.backdropFilter = 'blur(4px)';
    this._overlay.style.zIndex = '999999';
    this._overlay.style.display = 'flex';
    this._overlay.style.alignItems = 'center';
    this._overlay.style.justifyContent = 'center';
    this._overlay.style.opacity = '0';
    this._overlay.style.transition = 'opacity 0.3s ease';

    // Create iframe
    this._iframe = document.createElement('iframe');
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      amount: options.amount.toString(),
      interval: options.interval.toString(),
      title: options.title
    });
    
    this._iframe.src = `${this.baseUrl}/checkout?${params.toString()}`;
    this._iframe.style.width = '100%';
    this._iframe.style.maxWidth = '450px';
    this._iframe.style.height = '600px';
    this._iframe.style.border = 'none';
    this._iframe.style.borderRadius = '16px';
    this._iframe.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
    this._iframe.style.transform = 'translateY(20px)';
    this._iframe.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    this._iframe.allow = "clipboard-write"; // Allow wallet interactions if needed

    // Append and animate in
    this._overlay.appendChild(this._iframe);
    document.body.appendChild(this._overlay);

    // Trigger reflow
    void this._overlay.offsetWidth;

    // Animate
    this._overlay.style.opacity = '1';
    this._iframe.style.transform = 'translateY(0)';
  }

  closeModal() {
    if (this._overlay) {
      this._overlay.style.opacity = '0';
      this._iframe.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        if (this._overlay && this._overlay.parentNode) {
          this._overlay.parentNode.removeChild(this._overlay);
        }
        this._overlay = null;
        this._iframe = null;
      }, 300);
    }
  }
}

// Make globally available
window.MezoOS = MezoOS;
