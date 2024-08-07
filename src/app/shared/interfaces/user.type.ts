export interface User {
    id: number;
    username: string;
    password: string;
    token?: string;
}


export interface Details {
    days_left_in_trial: number;//5,
    subscription_id: string;//"sub_JsfpQO8IMTKveD",
    customer_id: string;//"cus_JsfoZCKGHwm3TI",
    subscription_status: string;//"active",
    subscription_plan: {
      plan_id: string;//"plan_JpqFsD1ZxidLsZ",
      name: string;//"pro",
      period_billing: string;//"year"
    },
    projects_created: number;//10,
    projects_allowed: string//"unlimited",
    words_generated: [
      {
        date: string; //"2021/08/31",
        words_generated: number; //20
      }
    ],
    total_words_in_plan: string; //"unlimited",
    contents_created: number; //29,
    activity: [
      {
        label: string; //"7 days ago",
        activitites: [
          {
            text: string; //"5 Blog titles listicle generated",
            date: string; //"2021-07-5 18:19:07.494176",
            image: string; //"https://img.icons8.com/flat-round/64/000000/read-message.png"
          }
        ]
      }
    ],
    favourite_tools: [
      {
        uuid: string; //"469d9c95-6e4d-386d-9f27-17dcd543b702",
        name: string; //"Google Descriptions",
        description: string;  //"This is a sample description for this tool. This is to be used as a placeholder",
        logo: string; //"https://img.icons8.com/color/50/000000/google-logo.png",
        function_call: string; //"google_descriptions",
        inputs: [
          {
            key: string; //"promotion",
            type: string; //"input",
            templateOptions: {
              label: string; //"Promotion",
              placeholder: string; //"This is the place holder text for the field",
              maxLength: number,
              minLength: number,
              required: boolean;
            }
          }
        ],
        categories: [
          {
            name: string;
          }
        ]
      }
    ],
    billing_cycle_renewal: string;//"2022/07/26, 11:17:27",
    billing_history: string; //"https://billing.stripe.com/session/_K9FEgCKIINkLPfxRlJI1I4na7rBbEpk",
    edit_payment_details: string; //"https://billing.stripe.com/session/_K9FEbQO4tiiRqveurKIAWvNuuEDrKql",
    upgrade_plan: string; //"https://billing.stripe.com/session/_K9FEJd8TUNIxBndeMImJbzOn5p5fixz",
    cancel_subscription: string; //"https://billing.stripe.com/session/_K9FEFEDQoJKLTNBBOkDnx37jIh6Hg4z"
  } 
  