&& (
    <>
        <Separator orientation="vertical" className="h-4"/>
        <span className="text-sm">
            {
            commander.squadron.name
        }
            - {
            commander.squadron.rank
        } </span>
    </>
)
} </CardDescription></div>{showActions && (
    <div className="flex gap-2">
        {
        onRefresh && (
            <Button variant="outline" size="sm"
                onClick={onRefresh}
                disabled={loading}>
                <RefreshCw className={
                    cn("w-4 h-4", loading && "animate-spin")
                }/>
            </Button>
        )
    }
        {
        onViewDetails && (
            <Button variant="outline" size="sm"
                onClick={onViewDetails}>
                <ExternalLink className="w-4 h-4"/>
            </Button>
        )
    } </div>
)} </div></CardHeader><CardContent className="space-y-4">
    {/* Ranks Section */}<div className="grid grid-cols-2 md:grid-cols-3 gap-4"><div className="space-y-2"><div className="flex items-center gap-2 text-sm font-medium">
    {
getRankIcon(commander.combatRank)}
Combat</div><Badge variant="outline" className="w-full justify-center">
    {
commander.combatRank || 'Unknown'} </Badge></div><div className="space-y-2"><div className="flex items-center gap-2 text-sm font-medium">
    {
getRankIcon(commander.tradeRank)}
