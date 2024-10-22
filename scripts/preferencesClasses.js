class BaseComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                .pill {
                    display: inline-flex;
                    background-color: #ffffffcc;
                    border-radius: 999px;
                    width: auto;
                    margin: 5px;
                    margin-left:0;
                    margin-right:10px;
                }
  
                .pillB {
                    display: inline-flex;
                    border-radius: 999px;
                    padding: 3px;
                    padding-right: 8px;
                    width: 100%;
                    align-items: center;
                }
                    
                .pillText {
                    font-size: 14px;
                    margin-left: 5px;
                    margin-right:4px;
                    color: ${this.color};
                }
            </style>
            <div class="pill" id="kkk">
                <button style= "border: none; background:none;" disabled class="pillB">
                        <svg class="pillIcon" width="20" height="20" viewBox="0 0 10 10" fill="none"
                        xmlns="http://www.w3.org/2000/svg">${this.imgSrc}</svg>
                    <div class="pillText"></div>
                    <svg id="pPlus" style="margin-left:4px; display:none;" width="14" height="14" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5 6L3.5 1" stroke="${this.color}" stroke-width="1.2" stroke-linecap="round"/>
                        <path d="M1 3.5H6" stroke="${this.color}" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                    <svg id="pX" style="margin-left:4px; display: none;" width="12" height="12" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6L5.95599 1.04321" stroke="${this.color}" stroke-width="1.4" stroke-linecap="round"/>
                        <path d="M6 5.95679L1.04401 1" stroke="${this.color}" stroke-width="1.4" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        `;
    }
}

class DataComponent extends BaseComponent {
    constructor() {
        super();
        this.color = '#426BFF';
        this.imgSrc = `<circle cx="5" cy="5" r="5" fill="#426BFF"/>
        <path d="M2.85819 8V2.4H4.95419C5.48752 2.4 5.96219 2.512 6.37819 2.736C6.79419 2.95733 7.12085 3.27733 7.35819 3.696C7.59552 4.112 7.71419 4.61333 7.71419 5.2C7.71419 5.78667 7.59552 6.28933 7.35819 6.708C7.12085 7.124 6.79419 7.444 6.37819 7.668C5.96219 7.88933 5.48752 8 4.95419 8H2.85819ZM3.88219 7.088H4.95419C5.31685 7.088 5.61952 7.012 5.86219 6.86C6.10485 6.708 6.28752 6.49067 6.41019 6.208C6.53285 5.92533 6.59419 5.58933 6.59419 5.2C6.59419 4.81067 6.53285 4.47467 6.41019 4.192C6.28752 3.90933 6.10485 3.692 5.86219 3.54C5.61952 3.388 5.31685 3.312 4.95419 3.312H3.88219V7.088Z" fill="white"/>`;
    }
}

class PurposeComponent extends BaseComponent {
    constructor() {
        super();
        this.color = '#6732FF';
        this.imgSrc = `<circle cx="5" cy="5" r="5" fill="#6732FF"/>
        <path d="M3.23319 8V2.4H5.22519C5.65452 2.4 6.01719 2.464 6.31319 2.592C6.60919 2.72 6.83319 2.91733 6.98519 3.184C7.13985 3.45067 7.21719 3.792 7.21719 4.208C7.21719 4.62933 7.14119 4.97733 6.98919 5.252C6.83719 5.524 6.61452 5.72667 6.32119 5.86C6.02785 5.99067 5.67052 6.056 5.24919 6.056H4.25719V8H3.23319ZM4.25719 5.2H5.12919C5.47852 5.2 5.73985 5.12133 5.91319 4.964C6.08919 4.80667 6.17719 4.56 6.17719 4.224C6.17719 3.888 6.08785 3.64267 5.90919 3.488C5.73319 3.33333 5.46519 3.256 5.10519 3.256H4.25719V5.2Z" fill="white"/>`;
    }
}

class RetentionComponent extends BaseComponent {
    constructor() {
        super();
        this.color = '#DB6900';
        this.imgSrc = `<circle cx="5" cy="5" r="5" fill="#DB6900"/>
        <path d="M3.11209 8V2.4H5.16009C5.54676 2.4 5.88409 2.46133 6.17209 2.584C6.46276 2.70667 6.68809 2.89333 6.84809 3.144C7.00809 3.39467 7.08809 3.712 7.08809 4.096C7.08809 4.50667 7.00009 4.83333 6.82409 5.076C6.65076 5.316 6.42143 5.50667 6.13609 5.648L7.40009 8H6.25609L5.17609 5.92C5.16809 5.92 5.16143 5.92 5.15609 5.92C5.15076 5.92 5.14409 5.92 5.13609 5.92H4.13609V8H3.11209ZM4.13609 5.064H4.88809C5.30943 5.064 5.60276 4.97867 5.76809 4.808C5.93343 4.63467 6.01609 4.416 6.01609 4.152C6.01609 3.872 5.93476 3.65333 5.77209 3.496C5.60943 3.336 5.32809 3.256 4.92809 3.256H4.13609V5.064Z" fill="white"/>`;
    }
}

//================================================================================================
//Data Objects

export class PersonalIdentifier extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Personal Identifier';
        //console.log(this.shadowRoot.childNodes[1]+"ss");
        //console.log(this.shadowRoot.children[1]);
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class ContactInformation extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Contact Information';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class HealthInformation extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Health Information';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class LocationInformation extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Location Information';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class ComputerInformation extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Computer Information';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class OnlineActivity extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Online Activity';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class FinancialInformation extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Financial Information';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class UserProfile extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'User Profile';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class IpAndId extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'IP and device ID';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class CookiesAndTracking extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Cookies And Tracking';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class SurveyData extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Survey Data';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class PersonalInformation extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Personal Information';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class DemographicInformation extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Demographic Information';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class OtherInformation extends DataComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Other Information';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

//================================================================================================
//Purpose Objects

export class AdvertisementPurposes extends PurposeComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Advertisement';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class ResearchPurposes extends PurposeComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Research';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class LegalPurposes extends PurposeComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Legal Requirement';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class MarketingPurposes extends PurposeComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Marketing';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class ServiceProvisionPurposes extends PurposeComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Service Provision';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class ServiceImprovementPurposes extends PurposeComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Service Improvement';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class OtherPurposes extends PurposeComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Other';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

//================================================================================================
//Retention Objects

export class LimitedRetention extends RetentionComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Limited';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class IndefiniteRetention extends RetentionComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Indefinitely';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class PeriodRetention extends RetentionComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Specified Period';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

export class OtherRetention extends RetentionComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.textContent = 'Other';
        this.shadowRoot.querySelector('.pillText').textContent = this.textContent;
    }
}

