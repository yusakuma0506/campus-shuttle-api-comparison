type RouteContext = {
  params: {
    busId: string;
  };
};

export async function POST(_: Request, context: RouteContext) {
  return Response.json({ busId: context.params.busId, message: "location placeholder" });
}
