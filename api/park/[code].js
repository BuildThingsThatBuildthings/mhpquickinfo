import { kv } from "@vercel/kv";

const VALID_PARK_CODES = ["MNSHAF", "MNRFC", "MNWAT", "MOGV", "MOASH", "MISOL"];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { code } = req.query;
  const parkCode = code?.toUpperCase();

  if (!VALID_PARK_CODES.includes(parkCode)) {
    res.status(400).json({ error: "Invalid park code" });
    return;
  }

  if (req.method === "GET") {
    try {
      const parkData = await kv.get(`park:${parkCode}`);
      res.status(200).json(parkData || { park_code: parkCode });
    } catch (error) {
      console.error("Error fetching park:", error);
      res.status(500).json({ error: "Failed to fetch park data" });
    }
  } else if (req.method === "POST") {
    try {
      let incomingBody = req.body;
      if (typeof incomingBody === "string") {
        try {
          incomingBody = JSON.parse(incomingBody);
        } catch {
          res.status(400).json({ error: "Invalid JSON body" });
          return;
        }
      }

      const {
        park_name,
        park_address,
        lot_rent,
        water_included,
        trash_included,
        sewer_included,
        electric_included,
        manager_name,
        manager_phone,
        manager_address,
        community_email,
        office_hours,
        lots,
        vacant_lots,
        homes_for_sale,
        vacant_homes,
        notes,
      } = incomingBody || {};

      const parkData = {
        park_code: parkCode,
        park_name,
        park_address,
        lot_rent:
          typeof lot_rent === "number" ? lot_rent : Number(lot_rent) || 0,
        water_included: water_included ? 1 : 0,
        trash_included: trash_included ? 1 : 0,
        sewer_included: sewer_included ? 1 : 0,
        electric_included: electric_included ? 1 : 0,
        manager_name,
        manager_phone,
        manager_address,
        community_email,
        office_hours,
        lots: typeof lots === "number" ? lots : Number(lots) || 0,
        vacant_lots: typeof vacant_lots === "number" ? vacant_lots : Number(vacant_lots) || 0,
        homes_for_sale: typeof homes_for_sale === "number" ? homes_for_sale : Number(homes_for_sale) || 0,
        vacant_homes: typeof vacant_homes === "number" ? vacant_homes : Number(vacant_homes) || 0,
        notes,
        last_updated: new Date().toISOString(),
      };

      await kv.set(`park:${parkCode}`, parkData);

      res.status(200).json({
        park_code: parkCode,
        message: "Park information saved successfully",
      });
    } catch (error) {
      console.error("Error saving park:", error);
      res.status(500).json({ error: "Failed to save park data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
