const PREFERENCE_KEYS = {
    fontSize: 'synapse_fontSize',
    bubbleStyle: 'synapse_bubbleStyle',
    animations: 'synapse_animations',
    sound: 'synapse_sound',
};

const DEFAULT_PREFERENCES = {
    fontSize: 'medium',
    bubbleStyle: 'rounded',
    animationsEnabled: true,
    messageSound: true,
};

export function getSynapsePreferences() {
    return {
        fontSize: localStorage.getItem(PREFERENCE_KEYS.fontSize) || DEFAULT_PREFERENCES.fontSize,
        bubbleStyle: localStorage.getItem(PREFERENCE_KEYS.bubbleStyle) || DEFAULT_PREFERENCES.bubbleStyle,
        animationsEnabled: localStorage.getItem(PREFERENCE_KEYS.animations) !== 'false',
        messageSound: localStorage.getItem(PREFERENCE_KEYS.sound) !== 'false',
    };
}

export function applySynapsePreferences(preferences = getSynapsePreferences()) {
    document.documentElement.setAttribute('data-font-size', preferences.fontSize);
    document.documentElement.setAttribute('data-bubble-style', preferences.bubbleStyle);
    document.documentElement.setAttribute(
        'data-animations',
        preferences.animationsEnabled ? 'enabled' : 'disabled'
    );
    document.documentElement.setAttribute(
        'data-message-sound',
        preferences.messageSound ? 'enabled' : 'disabled'
    );
}

export function saveSynapsePreference(key, value) {
    localStorage.setItem(PREFERENCE_KEYS[key], value);
}

export function areAnimationsEnabled() {
    return document.documentElement.getAttribute('data-animations') !== 'disabled';
}

export function isMessageSoundEnabled() {
    return document.documentElement.getAttribute('data-message-sound') !== 'disabled';
}

export function announcePreferenceChange() {
    window.dispatchEvent(new CustomEvent('synapse:preferences-changed', {
        detail: getSynapsePreferences(),
    }));
}
