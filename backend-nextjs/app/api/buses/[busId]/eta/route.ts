type RouteContext = {
  params: {
    busId: string;
  };
};

export async function GET(_: Request, context: RouteContext) {
  return Response.json({ busId: context.params.busId, message: "eta placeholder" });
}
