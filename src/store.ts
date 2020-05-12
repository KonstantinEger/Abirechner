type Subscription<S> = (newVal: S, oldVal: S | null) => void;

/**
 * A custom element which holds state. State can be read, set or listened to.
 * Reference to the object can be obtained like this:
 * ```js
 * const store = document.querySelector(AbiStoreElement.selector) as AbiStoreElement<StoreInterface>;
 * ```
 */
export class AbiStoreElement<S> extends HTMLElement {
  public static readonly selector = 'abi-store';

  private state: S | null = null;
  private subs: Array<Subscription<S>> = [];

  /**
   * Add a subscription which gets called when state changes.
   */
  public subscribe(sub: Subscription<S>): void {
    this.subs.push(sub);
  }

  /**
   * Remove a subscription from the array of subs.
   */
  public unsubscribe(sub: Subscription<S>): void {
    this.subs.filter(s => s !== sub);
  }

  /**
   * Get the current state. Returns `null` if no state has been set yet.
   */
  public getState(): S | null {
    return this.state;
  }

  /**
   * Set a new state. All subscriptions get called with the _new_ and the _old_
   * value. The internal state is set to new _before_ the subs get called.
   */
  public setState(newState: S): void {
    const oldState = this.state;
    this.state = newState;

    for (let i = 0; i < this.subs.length; i++) {
      this.subs[i](newState, oldState);
    }
  }
}

if (window.customElements.get(AbiStoreElement.selector) === undefined) {
  window.customElements.define(AbiStoreElement.selector, AbiStoreElement);
}

export interface StoreInterface {}
// create store
const store = document.createElement(AbiStoreElement.selector) as AbiStoreElement<StoreInterface>;
// set initial value
store.setState({});
// append to dom
document.body.appendChild(store);