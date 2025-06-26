import { Ad } from "../models/ad.model";

export function filterContact(ad: Ad): Ad {
  const { communication, name, phone } = ad.contact;
  const type = ad.contact.communication;
  switch (type) {
    case "calls-only": {
      return {
        ...ad,
        contact: {
          phone,
          name,
          communication,
        },
      };
    }
    case "calls-and-message": {
      return {
        ...ad,
        contact: {
          phone,
          name,
          communication,
        },
      };
    }
    case "message-only": {
      return {
        ...ad,
        contact: {
          name,
          communication,
        },
      };
    }
  }
}
